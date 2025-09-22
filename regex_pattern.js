function validateInput() {
  const validator = document.getElementById("validatorSelect").value;
  const input = document.getElementById("singleInput").value.trim();
  const result = document.getElementById("result");

  const patterns = {
  // Emails: user@example.com, firstname.lastname@company.co.uk
  email: /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?$/,

  // URLs: https://www.example.com, https://subdomain.example.org/page
  url: /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,

  // Phone numbers: (123) 456-7890 | 123-456-7890 | 123.456.7890
  phone: /^(\(\d{3}\)\s?\d{3}[-.]\d{4}|\d{3}[-.]\d{3}[-.]\d{4})$/,

  // Credit cards: 1234 5678 9012 3456 | 1234-5678-9012-3456
  credit_card: /^(\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{4})$/,

  // Time: 24-hour HH:MM and 12-hour h:MM AM/PM
    time24: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
    time12: /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM|am|pm)$/,

  // HTML tags: <p>, <div class="example">, <img src="image.jpg" alt="description">
  html_tag: /^<([a-z]+)(\s+[^<>]+)*\/?>$/i,

  // Hashtags: #example, #ThisIsAHashtag
  hashtag: /^#[\w]+$/,

  // Currency: $19.99, $1,234.56
  currency: /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/
};

  if (!patterns[validator]) {
    result.textContent = "❌ Unknown validator selected.";
    result.style.color = "red";
    return;
  }

  if (patterns[validator].test(input)) {
    result.textContent = "✅ Valid " + validator;
    result.style.color = "green";
  } else {
    result.textContent = "❌ Invalid " + validator;
    result.style.color = "red";
  }
}
