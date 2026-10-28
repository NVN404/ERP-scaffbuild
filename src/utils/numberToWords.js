// Converts numbers into Indian Currency Words (Lakhs, Crores format)
export function numberToIndianWords(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Zero';
  
  const n = Math.round(Number(num));
  if (n === 0) return 'Indian Rupees Zero Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigit(val) {
    if (val < 10) return singleDigits[val];
    if (val < 20) return twoDigits[val - 10];
    const tens = Math.floor(val / 10);
    const rem = val % 10;
    return `${tensMultiple[tens]}${rem > 0 ? ' ' + singleDigits[rem] : ''}`.trim();
  }

  function convertThreeDigit(val) {
    const hundred = Math.floor(val / 100);
    const rem = val % 100;
    let res = '';
    if (hundred > 0) {
      res += `${singleDigits[hundred]} Hundred`;
    }
    if (rem > 0) {
      res += `${res ? ' ' : ''}${convertTwoDigit(rem)}`;
    }
    return res.trim();
  }

  let crore = Math.floor(n / 10000000);
  let remAfterCrore = n % 10000000;

  let lakh = Math.floor(remAfterCrore / 100000);
  let remAfterLakh = remAfterCrore % 100000;

  let thousand = Math.floor(remAfterLakh / 1000);
  let remAfterThousand = remAfterLakh % 1000;

  let hundredPart = remAfterThousand;

  let parts = [];
  if (crore > 0) {
    parts.push(`${convertTwoDigit(crore)} Crore`);
  }
  if (lakh > 0) {
    parts.push(`${convertTwoDigit(lakh)} Lakh`);
  }
  if (thousand > 0) {
    parts.push(`${convertTwoDigit(thousand)} Thousand`);
  }
  if (hundredPart > 0) {
    parts.push(convertThreeDigit(hundredPart));
  }

  return `Indian Rupees ${parts.join(' ')} Only`;
}
