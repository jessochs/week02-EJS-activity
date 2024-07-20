
const form = document.querySelector("#updateReview")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })