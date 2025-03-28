const menuItems = document.querySelectorAll(".menu-item");
const totalPriceElement = document.getElementById("totalPrice");
const discountElement = document.getElementById("discount");
const discountInput = document.getElementById("discountInput");
const applyDiscountButton = document.getElementById("applyDiscount");
const submitOrderButton = document.getElementById("submitOrder");
const payableAmountElement = document.getElementById("payableAmount");
const serviceFeeElement = document.getElementById("serviceFee");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const thanksModal = document.querySelector(".thanks-text");
const orderDetails = document.getElementById("orderDetails");
const closeModal = modal.querySelector(".close");
const confirmButton = modal.querySelector(".confirm-button");
const totalSummary = modal.querySelector(".totalSummary");

function formatNumber(num) {
  return num.toLocaleString();
}

serviceFeeElement.innerHTML = formatNumber(12000);

let cart = [];

let currentDiscountPercentage = 0;

function updateTotalPrice() {
  const totalPrice = Number(totalPriceElement.innerHTML.replace(/,/g, ""));
  const serviceFee = Number(serviceFeeElement.innerHTML.replace(/,/g, ""));
  const discount = Number(discountElement.innerHTML.replace(/,/g, ""));

  let payableAmount = formatNumber(totalPrice + serviceFee - discount);

  payableAmountElement.innerHTML = totalPrice > 0 ? payableAmount : 0;
}

menuItems.forEach((menuItem) => {
  const increaseButton = menuItem.querySelector(".increase");
  const decreaseButton = menuItem.querySelector(".decrease");
  const countElement = menuItem.querySelector(".count");
  const pricePerItemElement = menuItem.querySelector("p span");
  const totalPricePerItemElement = menuItem.querySelector(
    ".section-price span"
  );

  increaseButton.addEventListener("click", () => {
    let count = Number(countElement.innerHTML);
    count++;

    countElement.innerHTML = count;

    const pricePerItem = Number(
      pricePerItemElement.innerHTML.replace(/,/g, "")
    );
    pricePerItemElement.innerHTML = formatNumber(pricePerItem);
    totalPricePerItemElement.innerHTML = formatNumber(count * pricePerItem);

    updateCart();
  });

  decreaseButton.addEventListener("click", () => {
    let count = Number(countElement.innerHTML);
    if (count > 0) {
      count--;

      countElement.innerHTML = count;

      const pricePerItem = Number(
        pricePerItemElement.innerHTML.replace(/,/g, "")
      );
      pricePerItemElement.innerHTML = formatNumber(pricePerItem);
      totalPricePerItemElement.innerHTML = formatNumber(count * pricePerItem);

      updateCart();
    }
  });
  const pricePerItem = Number(pricePerItemElement.innerHTML.replace(/,/g, ""));
  pricePerItemElement.innerHTML = formatNumber(pricePerItem);
});

function updateCart() {
  let total = 0;

  cart = [];

  menuItems.forEach((menuItem) => {
    const count = Number(menuItem.querySelector(".count").innerHTML);
    const pricePerItem = Number(
      menuItem.querySelector("p span").innerHTML.replace(/,/g, "")
    );

    if (count > 0) {
      const name = menuItem.querySelector("h3").innerHTML;
      const totalPricePerItem = count * pricePerItem;

      total += totalPricePerItem;

      cart.push({
        name,
        quantity: count,
        price: pricePerItem,
        total: totalPricePerItem,
      });
    }
  });

  totalPriceElement.innerHTML = formatNumber(total);

  if (currentDiscountPercentage > 0) {
    const discount = (currentDiscountPercentage * total) / 100;
    discountElement.innerHTML = formatNumber(discount);
  }

  updateTotalPrice();
}

applyDiscountButton.addEventListener("click", () => {
  const discountCode = discountInput.value.trim().toLowerCase();
  const totalPrice = Number(totalPriceElement.innerHTML.replace(/,/g, ""));

  discountElement.innerHTML = "0";
  currentDiscountPercentage = 0;

  if (discountCode === "gold") {
    currentDiscountPercentage = 20;
    alert("کد تخفیف با موفقیت اعمال شد.");
    // discountInput.disabled = true;
  } else if (discountCode === "silver") {
    currentDiscountPercentage = 15;
    alert("کد تخفیف با موفقیت اعمال شد.");
    // discountInput.disabled = true;
  } else if (discountCode === "bronze") {
    currentDiscountPercentage = 10;
    alert("کد تخفیف با موفقیت اعمال شد.");
    // discountInput.disabled = true;
  } else {
    discountElement.innerHTML = "0";
    alert("کد تخفیف نامعتبر است.");
  }

  const discount = (currentDiscountPercentage * totalPrice) / 100;
  discountElement.innerHTML = formatNumber(discount);

  updateTotalPrice();
});

discountInput.addEventListener("keydown" , (event) => {
  if(event.key === "Enter"){
    applyDiscountButton.click();
  }
})

submitOrderButton.addEventListener("click", () => {
  const payableAmount = Number(
    payableAmountElement.innerHTML.replace(/,/g, "")
  );
  const totalPrice = Number(totalPriceElement.innerHTML.replace(/,/g, ""));

  if (payableAmount > 0 && totalPrice !== 0) {
    const userConfirmed = confirm("از خرید خود اطمینان دارید؟");

    if (userConfirmed) {
      overlay.style.display = "block";
      modal.style.display = "block";
      document.body.style.overflow = "hidden";

      displayListDetails();
    }
  } else {
    alert("سبد خرید شما خالیست.");
  }
});

closeModal.addEventListener("click", () => {
  overlay.style.display = "none";
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

confirmButton.addEventListener("click", () => {
  modal.style.display = "none";
  thanksModal.style.display = "block";

  thanksModal.innerHTML = `
  <div>سفارشتان با موفقیت ثبت شد.</div>
  <div>به امید دیدار مجدد!</div>
  `;

  cart = [];

  resetMenuItems();
  setTimeout(() => {
    overlay.style.display = "none";
    thanksModal.style.display = "none";
    document.body.style.overflow = "auto";
  }, 5000);
});

function displayListDetails() {
  const totalPrice = Number(totalPriceElement.innerHTML.replace(/,/g, ""));
  const discount = Number(discountElement.innerHTML.replace(/,/g, ""));
  const serviceFee = Number(serviceFeeElement.innerHTML.replace(/,/g, ""));
  const payableAmount = Number(
    payableAmountElement.innerHTML.replace(/,/g, "")
  );

  orderDetails.innerHTML = `
          <h3 class = "orderDetailContainer-heading">جزئیات سبد خرید</h3>
          <table>
            <thead>
              <tr>
                <th class = "tableHeader">نام محصول</th>
                <th class = "tableHeader">تعداد</th>
                <th class = "tableHeader">قیمت واحد</th>
                <th class = "tableHeader">قیمت کل</th>
              </tr>
            </thead>
            <tbody>
              ${cart
                .map(
                  (item) =>
                    `<tr>
                      <td class = "tableData">${item.name}</td>
                      <td class = "tableData">${item.quantity}</td>
                      <td class = "tableData">${formatNumber(
                        item.price
                      )} تومان</td>
                      <td class = "tableData">${formatNumber(
                        item.price * item.quantity
                      )} تومان</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
          `;

  totalSummary.innerHTML = `<table class="summary-table">
                <tbody>
                  <tr>
                    <th>قیمت کل فاکتور</th>
                    <td><span>${formatNumber(totalPrice)}</span> تومان</td>
                  </tr>
                  <tr>
                    <th>حق سرویس و کارمزد</th>
                    <td><span>${formatNumber(serviceFee)}</span> تومان</td>
                  </tr>
                  <tr>
                    <th>تخفیف</th>
                    <td><span>${formatNumber(discount)}</span> تومان</td>
                  </tr>
                  <tr>
                    <th>قیمت نهایی</th>
                    <td><span id=>${formatNumber(
                      payableAmount
                    )}</span> تومان</td>
                  </tr>
                </tbody>
              </table>`;
}

function resetMenuItems() {
  menuItems.forEach((menuItem) => {
    const countElement = menuItem.querySelector(".count");
    const totalPricePerItemElement = menuItem.querySelector(
      ".section-price span"
    );

    countElement.innerHTML = "0";
    totalPricePerItemElement.innerHTML = "0";
  });

  updateCart();
}
