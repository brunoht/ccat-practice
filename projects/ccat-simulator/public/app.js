(() => {
  const CCAT_SECONDS_PER_QUESTION = (15 * 60) / 50; // 18

  const els = {
    themeSelect: document.getElementById("theme-select"),
    screenSelect: document.getElementById("screen-select"),
    screenSetup: document.getElementById("screen-setup"),
    screenExam: document.getElementById("screen-exam"),
    screenResults: document.getElementById("screen-results"),
    selectStatus: document.getElementById("select-status"),
    testSelect: document.getElementById("test-select"),
    btnNext: document.getElementById("btn-next"),
    setupTitle: document.getElementById("setup-title"),
    setupCount: document.getElementById("setup-count"),
    secondsPerQuestion: document.getElementById("seconds-per-question"),
    totalSeconds: document.getElementById("total-seconds"),
    totalDisplay: document.getElementById("total-display"),
    btnBackSelect: document.getElementById("btn-back-select"),
    btnStart: document.getElementById("btn-start"),
    examProgress: document.getElementById("exam-progress"),
    examTotal: document.getElementById("exam-total"),
    examTimer: document.getElementById("exam-timer"),
    examArea: document.getElementById("exam-area"),
    examStem: document.getElementById("exam-stem"),
    examChoices: document.getElementById("exam-choices"),
    btnConfirm: document.getElementById("btn-confirm"),
    resultsSummary: document.getElementById("results-summary"),
    resultsSave: document.getElementById("results-save"),
    btnAgain: document.getElementById("btn-again"),
  };

  const state = {
    tests: [],
    selectedFilename: "",
    testFile: null,
    test: null,
    secondsPerQuestion: CCAT_SECONDS_PER_QUESTION,
    totalSeconds: 0,
    questionIndex: 0,
    selectedChoice: null,
    answers: [],
    questionStartedAt: 0,
    examStartedAt: 0,
    remainingMs: 0,
    timerId: null,
    finishing: false,
    syncSource: null,
  };

  function showScreen(name) {
    const map = {
      select: els.screenSelect,
      setup: els.screenSetup,
      exam: els.screenExam,
      results: els.screenResults,
    };
    Object.entries(map).forEach(([key, el]) => {
      el.classList.toggle("hidden", key !== name);
    });
  }

  function applyTheme(theme) {
    const value = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", value);
    els.themeSelect.value = value;
    localStorage.setItem("ccat-simulator-theme", value);
  }

  function formatDuration(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }

  function updateTotalDisplay() {
    const total = Number(els.totalSeconds.value) || 0;
    els.totalDisplay.textContent = formatDuration(total);
  }

  function syncFromSecondsPerQuestion() {
    state.syncSource = "spq";
    const n = state.test?.questions?.length || 0;
    let spq = Number(els.secondsPerQuestion.value);
    if (!Number.isFinite(spq) || spq < 1) {
      spq = 1;
      els.secondsPerQuestion.value = "1";
    }
    spq = Math.round(spq);
    els.secondsPerQuestion.value = String(spq);
    const total = Math.max(1, Math.round(spq * n));
    els.totalSeconds.value = String(total);
    state.secondsPerQuestion = spq;
    state.totalSeconds = total;
    updateTotalDisplay();
    state.syncSource = null;
  }

  function syncFromTotal() {
    state.syncSource = "total";
    const n = state.test?.questions?.length || 0;
    let total = Number(els.totalSeconds.value);
    if (!Number.isFinite(total) || total < 1) {
      total = 1;
      els.totalSeconds.value = "1";
    }
    total = Math.round(total);
    els.totalSeconds.value = String(total);
    const spq = n > 0 ? Math.max(1, Math.round(total / n)) : 1;
    els.secondsPerQuestion.value = String(spq);
    state.secondsPerQuestion = spq;
    state.totalSeconds = total;
    updateTotalDisplay();
    state.syncSource = null;
  }

  async function loadTestList() {
    els.selectStatus.textContent = "Loading tests…";
    els.selectStatus.className = "status";
    els.testSelect.disabled = true;
    els.btnNext.disabled = true;
    els.testSelect.innerHTML = "";

    try {
      const res = await fetch("/api/tests");
      if (!res.ok) {
        throw new Error("Failed to load tests");
      }
      const data = await res.json();
      state.tests = Array.isArray(data.tests) ? data.tests : [];

      if (state.tests.length === 0) {
        els.selectStatus.textContent = "No tests available";
        els.selectStatus.className = "status error";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "No tests available";
        els.testSelect.appendChild(opt);
        return;
      }

      els.selectStatus.textContent = `${state.tests.length} test(s) found.`;
      els.selectStatus.className = "status ok";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Select a test…";
      els.testSelect.appendChild(placeholder);

      for (const test of state.tests) {
        const opt = document.createElement("option");
        opt.value = test.filename;
        opt.textContent = `${test.title} (${test.questionCount} q) — ${test.filename}`;
        els.testSelect.appendChild(opt);
      }

      els.testSelect.disabled = false;
    } catch (err) {
      console.error(err);
      els.selectStatus.textContent = "Could not load tests from the server.";
      els.selectStatus.className = "status error";
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Unavailable";
      els.testSelect.appendChild(opt);
    }
  }

  async function goToSetup() {
    const filename = els.testSelect.value;
    if (!filename) {
      return;
    }

    els.btnNext.disabled = true;
    try {
      const res = await fetch(`/api/tests/${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load test");
      }

      state.selectedFilename = filename;
      state.testFile = filename;
      state.test = data.test;
      const n = state.test.questions.length;
      const spq = Math.round(CCAT_SECONDS_PER_QUESTION);

      els.setupTitle.textContent = `${state.test.title} (${filename})`;
      els.setupCount.textContent = String(n);
      els.secondsPerQuestion.value = String(spq);
      syncFromSecondsPerQuestion();
      showScreen("setup");
    } catch (err) {
      console.error(err);
      els.selectStatus.textContent = err.message || "Failed to load selected test";
      els.selectStatus.className = "status error";
    } finally {
      els.btnNext.disabled = !els.testSelect.value;
    }
  }

  function clearTimer() {
    if (state.timerId != null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateTimerDisplay() {
    const secondsLeft = Math.ceil(state.remainingMs / 1000);
    els.examTimer.textContent = formatDuration(secondsLeft);
    els.examTimer.classList.remove("warn", "critical");
    if (secondsLeft <= 30) {
      els.examTimer.classList.add("critical");
    } else if (secondsLeft <= 60) {
      els.examTimer.classList.add("warn");
    }
  }

  function renderQuestion() {
    const q = state.test.questions[state.questionIndex];
    state.selectedChoice = null;
    state.questionStartedAt = Date.now();
    els.examProgress.textContent = String(state.questionIndex + 1);
    els.examTotal.textContent = String(state.test.questions.length);
    els.examArea.textContent = q.area;
    els.examStem.textContent = q.stem;
    els.examChoices.innerHTML = "";
    els.btnConfirm.disabled = true;

    q.choices.forEach((choice, index) => {
      const label = document.createElement("label");
      label.className = "choice";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "exam-choice";
      input.value = String(index);
      input.addEventListener("change", () => {
        state.selectedChoice = index;
        els.btnConfirm.disabled = false;
      });
      const span = document.createElement("span");
      span.textContent = choice;
      label.appendChild(input);
      label.appendChild(span);
      els.examChoices.appendChild(label);
    });
  }

  function recordCurrentAnswer(selectedIndex) {
    const q = state.test.questions[state.questionIndex];
    const timeMsSpent = Math.max(0, Date.now() - state.questionStartedAt);
    state.answers[state.questionIndex] = {
      questionId: q.id,
      area: q.area,
      selectedIndex: selectedIndex == null ? null : selectedIndex,
      correctIndex: q.answerIndex,
      isCorrect: selectedIndex != null && selectedIndex === q.answerIndex,
      timeMsSpent,
      stem: q.stem,
      choices: q.choices,
    };
  }

  function fillUnansweredFrom(index) {
    for (let i = index; i < state.test.questions.length; i += 1) {
      if (state.answers[i]) {
        continue;
      }
      const q = state.test.questions[i];
      state.answers[i] = {
        questionId: q.id,
        area: q.area,
        selectedIndex: null,
        correctIndex: q.answerIndex,
        isCorrect: false,
        timeMsSpent: 0,
        stem: q.stem,
        choices: q.choices,
      };
    }
  }

  function buildAttemptPayload() {
    const items = state.answers.map((item) => ({
      questionId: item.questionId,
      area: item.area,
      selectedIndex: item.selectedIndex,
      correctIndex: item.correctIndex,
      isCorrect: item.isCorrect,
      timeMsSpent: item.timeMsSpent,
      stem: item.stem,
      choices: item.choices,
    }));

    const answered = items.filter((i) => i.selectedIndex != null);
    const correctCount = items.filter((i) => i.isCorrect).length;
    const answeredCount = answered.length;
    const unansweredCount = items.length - answeredCount;
    const answeredMs = answered.reduce((sum, i) => sum + i.timeMsSpent, 0);
    const allMs = items.reduce((sum, i) => sum + i.timeMsSpent, 0);

    const byArea = {};
    for (const item of items) {
      if (!byArea[item.area]) {
        byArea[item.area] = { correct: 0, wrong: 0, unanswered: 0, total: 0 };
      }
      byArea[item.area].total += 1;
      if (item.selectedIndex == null) {
        byArea[item.area].unanswered += 1;
      } else if (item.isCorrect) {
        byArea[item.area].correct += 1;
      } else {
        byArea[item.area].wrong += 1;
      }
    }

    const finishedAt = new Date().toISOString();
    const durationSecondsUsed = Math.max(
      0,
      Math.round((Date.now() - state.examStartedAt) / 1000)
    );

    return {
      testId: state.test.id,
      testTitle: state.test.title,
      testFile: state.testFile,
      startedAt: new Date(state.examStartedAt).toISOString(),
      finishedAt,
      durationSecondsConfigured: state.totalSeconds,
      durationSecondsUsed,
      questionCount: items.length,
      correctCount,
      answeredCount,
      unansweredCount,
      accuracy: items.length ? Number((correctCount / items.length).toFixed(4)) : 0,
      averageMsPerQuestion: answeredCount
        ? Math.round(answeredMs / answeredCount)
        : 0,
      averageMsPerQuestionIncludingUnanswered: items.length
        ? Math.round(allMs / items.length)
        : 0,
      byArea,
      answerKey: items.map((i) => ({
        questionId: i.questionId,
        selectedIndex: i.selectedIndex,
        correctIndex: i.correctIndex,
        isCorrect: i.isCorrect,
      })),
      items,
    };
  }

  async function finishExam({ includeCurrentSelection = false } = {}) {
    if (state.finishing) {
      return;
    }
    state.finishing = true;
    clearTimer();
    els.btnConfirm.disabled = true;

    if (!state.answers[state.questionIndex]) {
      const selected =
        includeCurrentSelection && state.selectedChoice != null
          ? state.selectedChoice
          : null;
      recordCurrentAnswer(selected);
    }
    fillUnansweredFrom(state.questionIndex + 1);
    const payload = buildAttemptPayload();

    showScreen("results");
    renderResults(payload);
    els.resultsSave.textContent = "Saving attempt…";
    els.resultsSave.className = "status";

    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save attempt");
      }
      els.resultsSave.textContent = `Attempt saved as ${data.filename}`;
      els.resultsSave.className = "status ok";
    } catch (err) {
      console.error(err);
      els.resultsSave.textContent =
        err.message || "Attempt finished but could not be saved to disk.";
      els.resultsSave.className = "status error";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function reviewChoiceClass(index, selectedIndex, correctIndex) {
    const isCorrect = index === correctIndex;
    const isSelected = selectedIndex != null && index === selectedIndex;
    if (isSelected && isCorrect) {
      return "review-choice is-correct-selected";
    }
    if (isSelected && !isCorrect) {
      return "review-choice is-wrong";
    }
    if (isCorrect) {
      return "review-choice is-correct";
    }
    return "review-choice";
  }

  function renderAnswerKey(items) {
    const questions = (items || [])
      .map((item, index) => {
        const choices = Array.isArray(item.choices) ? item.choices : [];
        const choiceHtml = choices
          .map((choice, choiceIndex) => {
            const className = reviewChoiceClass(
              choiceIndex,
              item.selectedIndex,
              item.correctIndex
            );
            return `<div class="${className}">${escapeHtml(choice)}</div>`;
          })
          .join("");

        const yourAnswer =
          item.selectedIndex != null && choices[item.selectedIndex] != null
            ? escapeHtml(choices[item.selectedIndex])
            : "—";
        const correctAnswer =
          item.correctIndex != null && choices[item.correctIndex] != null
            ? escapeHtml(choices[item.correctIndex])
            : "—";

        return `
          <article class="review-question">
            <h3 class="review-meta">Q${index + 1} · ${escapeHtml(item.area || "—")}</h3>
            <p class="review-stem">${escapeHtml(item.stem || "")}</p>
            <div class="review-choices">${choiceHtml}</div>
            <p class="review-line"><strong>Your answer:</strong> ${yourAnswer}</p>
            <p class="review-line"><strong>Correct answer:</strong> ${correctAnswer}</p>
          </article>
        `;
      })
      .join("");

    return `
      <details class="answer-key">
        <summary>View questions</summary>
        <div class="answer-key-body">${questions}</div>
      </details>
    `;
  }

  function renderResults(payload) {
    const areaLines = Object.entries(payload.byArea)
      .map(
        ([area, stats]) =>
          `<li><strong>${escapeHtml(area)}</strong>: ${stats.correct} correct, ${stats.wrong} wrong, ${stats.unanswered} unanswered</li>`
      )
      .join("");

    els.resultsSummary.innerHTML = `
      <div><strong>Score:</strong> ${payload.correctCount} / ${payload.questionCount}</div>
      <div><strong>Answered:</strong> ${payload.answeredCount} (unanswered: ${payload.unansweredCount})</div>
      <div><strong>Accuracy:</strong> ${(payload.accuracy * 100).toFixed(1)}%</div>
      <div><strong>Avg time / answered question:</strong> ${(payload.averageMsPerQuestion / 1000).toFixed(1)} s</div>
      <div><strong>Configured duration:</strong> ${formatDuration(payload.durationSecondsConfigured)}</div>
      <div><strong>Time used:</strong> ${formatDuration(payload.durationSecondsUsed)}</div>
      <ul class="by-area">${areaLines}</ul>
      ${renderAnswerKey(payload.items)}
    `;
  }

  function startExam() {
    syncFromTotal();
    state.questionIndex = 0;
    state.answers = new Array(state.test.questions.length);
    state.finishing = false;
    state.examStartedAt = Date.now();
    state.remainingMs = state.totalSeconds * 1000;
    clearTimer();
    showScreen("exam");
    renderQuestion();
    updateTimerDisplay();

    state.timerId = setInterval(() => {
      state.remainingMs -= 250;
      if (state.remainingMs <= 0) {
        state.remainingMs = 0;
        updateTimerDisplay();
        finishExam();
        return;
      }
      updateTimerDisplay();
    }, 250);
  }

  function confirmAndNext() {
    if (state.selectedChoice == null || state.finishing) {
      return;
    }
    recordCurrentAnswer(state.selectedChoice);
    const next = state.questionIndex + 1;
    if (next >= state.test.questions.length) {
      finishExam({ includeCurrentSelection: true });
      return;
    }
    state.questionIndex = next;
    renderQuestion();
  }

  function resetToSelect() {
    clearTimer();
    state.finishing = false;
    state.test = null;
    state.testFile = null;
    state.selectedFilename = "";
    state.answers = [];
    els.testSelect.value = "";
    els.btnNext.disabled = true;
    showScreen("select");
    loadTestList();
  }

  els.themeSelect.addEventListener("change", () => {
    applyTheme(els.themeSelect.value);
  });

  els.testSelect.addEventListener("change", () => {
    els.btnNext.disabled = !els.testSelect.value;
  });

  els.btnNext.addEventListener("click", () => {
    goToSetup();
  });

  els.btnBackSelect.addEventListener("click", () => {
    showScreen("select");
  });

  els.secondsPerQuestion.addEventListener("input", () => {
    if (state.syncSource === "total") {
      return;
    }
    syncFromSecondsPerQuestion();
  });

  els.totalSeconds.addEventListener("input", () => {
    if (state.syncSource === "spq") {
      return;
    }
    syncFromTotal();
  });

  els.btnStart.addEventListener("click", () => {
    startExam();
  });

  els.btnConfirm.addEventListener("click", () => {
    confirmAndNext();
  });

  els.btnAgain.addEventListener("click", () => {
    resetToSelect();
  });

  applyTheme(localStorage.getItem("ccat-simulator-theme") || "light");
  showScreen("select");
  loadTestList();
})();
