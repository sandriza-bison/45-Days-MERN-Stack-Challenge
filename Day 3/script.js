// element refs
const resultDiv = document.getElementById('result');
const marksInput = document.getElementById('marks');
const calcMarksBtn = document.getElementById('calcMarksBtn');
const resetBtn = document.getElementById('resetBtn');

const gradeInput = document.getElementById('gradeInput');
const gradeToRangeBtn = document.getElementById('gradeToRangeBtn');

// helper: retrigger show animation
function triggerShow(el) {
  el.classList.remove('show');
  void el.offsetWidth; // reflow
  el.classList.add('show');
}

/* -------------------------
   Marks -> Grade
   -------------------------*/
function calculateGrade() {
  const raw = marksInput.value;
  const marks = Number(raw);

  if (raw === "" || isNaN(marks) || marks < 0 || marks > 100) {
    resultDiv.innerHTML = "⚠️ Please enter valid marks between 0 and 100.";
    resultDiv.style.color = "#d62828";
    triggerShow(resultDiv);
    return;
  }

  let grade = "";
  let color = "";
  let emoji = "";

  if (marks >= 90) { grade = "A"; color = "#2bb673"; emoji = "🌟"; }
  else if (marks >= 80) { grade = "B"; color = "#26a69a"; emoji = "🎯"; }
  else if (marks >= 70) { grade = "C"; color = "#ffb703"; emoji = "👍"; }
  else if (marks >= 60) { grade = "D"; color = "#ff8a65"; emoji = "🔸"; }
  else { grade = "F"; color = "#d62828"; emoji = "❌"; }

  resultDiv.innerHTML = `${emoji} You scored <b>${marks}</b>. Your grade is <b>${grade}</b>.`;
  resultDiv.style.color = color;
  triggerShow(resultDiv);
}

/* -------------------------
   Grade -> Range
   -------------------------*/
function showRangeFromGrade() {
  const raw = gradeInput.value.trim().toUpperCase();
  if (!raw || !/^[A-F]$/.test(raw)) {
    resultDiv.innerHTML = "⚠️ Enter a grade letter A–F (e.g., A, B, C).";
    resultDiv.style.color = "#d62828";
    triggerShow(resultDiv);
    return;
  }

  let range = "";
  let color = "";
  let emoji = "";

  switch (raw) {
    case "A": range = "90–100"; color = "#2bb673"; emoji = "🌟"; break;
    case "B": range = "80–89";  color = "#26a69a"; emoji = "🎯"; break;
    case "C": range = "70–79";  color = "#ffb703"; emoji = "👍"; break;
    case "D": range = "60–69";  color = "#ff8a65"; emoji = "🔸"; break;
    case "F": range = "< 60";   color = "#d62828"; emoji = "❌"; break;
  }

  resultDiv.innerHTML = `${emoji} Grade <b>${raw}</b> corresponds to marks <b>${range}</b>.`;
  resultDiv.style.color = color;
  triggerShow(resultDiv);
}

/* -------------------------
   Reset
   -------------------------*/
function resetAll() {
  marksInput.value = "";
  gradeInput.value = "";
  resultDiv.classList.remove('show');
  resultDiv.innerHTML = "";
}

/* -------------------------
   Events
   -------------------------*/
calcMarksBtn.addEventListener('click', calculateGrade);
gradeToRangeBtn.addEventListener('click', showRangeFromGrade);
resetBtn.addEventListener('click', resetAll);

// Enter key
marksInput.addEventListener('keydown', e => { if (e.key === 'Enter') calculateGrade(); });
gradeInput.addEventListener('keydown', e => { if (e.key === 'Enter') showRangeFromGrade(); });

/* -------------------------
   Tooltip
   -------------------------*/
document.querySelectorAll('.tooltip').forEach(wrapper => {
  wrapper.addEventListener('click', e => {
    e.stopPropagation();
    wrapper.classList.toggle('show');
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.tooltip.show').forEach(el => el.classList.remove('show'));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.tooltip.show').forEach(el => {
      el.classList.remove('show');
      el.blur && el.blur();
    });
  }
});
