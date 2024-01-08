// Home Canvas Animation
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Circle {
  constructor(speed, width, x, y) {
    this.radius = 40;
    this.speed = speed;
    this.width = width;
    this.x = x;
    this.y = y;
    this.opacity = 0.01 + Math.random() * 0.5;
    this.counter = 0;
  }
  update() {
    this.counter += this.speed;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.x + Math.cos(this.counter / 50) * this.radius,
      this.y + Math.sin(this.counter / 50) * this.radius,
      this.width,
      0,
      Math.PI * 2,
      false
    );
    ctx.closePath();
    ctx.fillStyle = "rgba(235, 245, 251," + this.opacity + ")";
    ctx.fill();
  }
}

const circles = [];
const circleCount = 100;

for (let i = 0; i < circleCount; i++) {
  const speed = 0.2 + Math.random() * 3;
  const width = 1 + Math.random() * 40;
  const x = Math.round(Math.random() * canvas.width);
  const y = Math.round(Math.random() * canvas.height);

  const circle = new Circle(speed, width, x, y);
  circles.push(circle);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach((circle) => {
    circle.update();
    circle.draw(ctx);
  });
  requestAnimationFrame(animate);
}

animate();

// Custom Input
const fileInputOne = document.getElementById("file_input_1");
const fileInputTwo = document.getElementById("file_input_2");
const customInputOne = document.getElementsByClassName("custom_input")[0];
const customInputTwo = document.getElementsByClassName("custom_input")[1];
const pdfPreviewOne = document.getElementById("pdf_preview_1");
const pdfPreviewTwo = document.getElementById("pdf_preview_2");
const resultPreviewOne = document.getElementById("result_preview_1");
const resultPreviewTwo = document.getElementById("result_preview_2");
const equalText = document.getElementById("equal");
const notEqualText = document.getElementById("not_equal");

customInputOne.addEventListener("click", () => {
  fileInputOne.click();
});

fileInputOne.addEventListener("change", (e) => {
  const fileInput = e.target;
  if (fileInput.files && fileInput.files[0]) {
    const pdfIcon = document.getElementsByClassName("pdf_icon")[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const pdfData = e.target.result;
      pdfPreviewOne.src = `data:application/pdf;base64,${btoa(pdfData)}`;
    };

    pdfIcon.style.display = "none";
    customInputOne.style.width = "350px";
    customInputOne.style.height = "380px";
    customInputOne.style.background = "#323639";
    reader.readAsBinaryString(fileInput.files[0]);
  }
});

customInputTwo.addEventListener("click", () => {
  fileInputTwo.click();
});

fileInputTwo.addEventListener("change", (e) => {
  const fileInput = e.target;
  if (fileInput.files && fileInput.files[0]) {
    const pdfIcon = document.getElementsByClassName("pdf_icon")[1];

    const reader = new FileReader();
    reader.onload = function (e) {
      const pdfData = e.target.result;
      pdfPreviewTwo.src = `data:application/pdf;base64,${btoa(pdfData)}`;
    };

    pdfIcon.style.display = "none";
    customInputTwo.style.width = "350px";
    customInputTwo.style.height = "380px";
    customInputTwo.style.background = "#323639";
    reader.readAsBinaryString(fileInput.files[0]);
  }
});

// Submit Files
const submitBtn = document.getElementById("submit_btn");

submitBtn.addEventListener("click", async () => {
  try {
    const formData = new FormData();
    formData.append("files", fileInputOne.files[0]);
    formData.append("files", fileInputTwo.files[0]);

    const response = await fetch("/api/find-match", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    let textOne = "";
    let textTwo = "";

    const textOneArray = result.textOne.split(" ");
    const textTwoArray = result.textTwo.split(" ");

    for (
      let i = 0;
      i < Math.min(textOneArray.length, textTwoArray.length);
      i++
    ) {
      if (textOneArray[i] !== textTwoArray[i]) {
        textOne += " " + `<span class="highlight">${textOneArray[i]}</span>`;
        textTwo += " " + `<span class="highlight">${textTwoArray[i]}</span>`;
      } else {
        textOne += " " + textOneArray[i];
        textTwo += " " + textTwoArray[i];
      }
    }

    customInputOne.style.display = "none";
    customInputTwo.style.display = "none";
    submitBtn.style.display = "none";

    if (result.match) equalText.style.display = "block";
    else notEqualText.style.display = "block";

    resultPreviewOne.innerHTML = textOne;
    resultPreviewOne.style.display = "block";
    resultPreviewTwo.innerHTML = textTwo;
    resultPreviewTwo.style.display = "block";
    console.log(result);
  } catch (err) {
    console.log(err);
  }
});
