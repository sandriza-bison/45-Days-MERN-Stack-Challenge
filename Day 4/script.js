const skills = [
  { name: "HTML", proficiency: "Advanced", emoji: "📄" },
  { name: "CSS", proficiency: "Advanced", emoji: "🎨" },
  { name: "JavaScript", proficiency: "Beginner", emoji: "🟨" }
];

const skillsList = document.getElementById("skills-list");

skills.forEach((skill, index) => {
  const li = document.createElement("li");
  li.innerHTML = `${skill.emoji} ${skill.name} <span class="tooltip">${skill.proficiency}</span>`;
  skillsList.appendChild(li);

  // Fade-in animation
  setTimeout(() => {
    li.classList.add("show");
  }, index * 150);
});
