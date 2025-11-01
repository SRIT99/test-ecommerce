// @desc    Parse HTML data from Kalimati PWA files
// @param   {string} html - HTML content
// @param   {string} lang - Language code
// @return  {Object} Parsed market data
const parseHTMLData = (html, lang) => {
  // Create temporary DOM element (simplified version)
  // In a real implementation, you might use JSDOM or similar
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const headerData = tempDiv.querySelectorAll('td[colspan="5"]');
  const subtitle = headerData[0]?.textContent.trim() || '';
  const date = headerData[1]?.textContent.trim() || '';
  
  const prices = [];
  const rows = tempDiv.querySelectorAll('[class*="row"]');
  
  rows.forEach((row, index) => {
    if (row.children.length >= 5) {
      prices.push({
        id: index + 1,
        name: row.children[0].textContent.trim(),
        unit: row.children[1].textContent.trim(),
        min: row.children[2].textContent.trim(),
        max: row.children[3].textContent.trim(),
        avg: row.children[4].textContent.trim(),
        category: categorizeProduct(row.children[0].textContent.trim())
      });
    }
  });
  
  return {
    subtitle,
    date,
    prices,
    lastUpdated: new Date().toISOString(),
    lang
  };
};

// @desc    Categorize products based on name
// @param   {string} productName - Name of the product
// @return  {string} Category
const categorizeProduct = (productName) => {
  const name = productName.toLowerCase();
  
  const categories = {
    fruits: ['apple', 'banana', 'orange', 'mango', 'grape', 'pineapple', 'papaya', 'lemon'],
    vegetables: ['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'cauliflower', 'pea', 'spinach'],
    spices: ['ginger', 'garlic', 'turmeric', 'chili', 'coriander'],
    grains: ['rice', 'wheat', 'lentil', 'bean']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'others';
};

// @desc    Sort products by field
// @param   {Array} products - Array of products
// @param   {string} field - Field to sort by
// @param   {string} order - Sort order (asc/desc)
// @param   {string} lang - Language for number conversion
// @return  {Array} Sorted products
const sortProducts = (products, field, order = 'asc', lang = 'en') => {
  return [...products].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];
    
    // Handle number conversion for Nepali numbers
    if (field === 'min' || field === 'max' || field === 'avg') {
      aValue = convertToNumber(aValue, lang);
      bValue = convertToNumber(bValue, lang);
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    let comparison = 0;
    if (aValue > bValue) comparison = 1;
    if (aValue < bValue) comparison = -1;
    
    return order === 'desc' ? comparison * -1 : comparison;
  });
};

// @desc    Convert Nepali numbers to English numbers
// @param   {string} text - Text with numbers
// @param   {string} lang - Language code
// @return  {number} Converted number
const convertToNumber = (text, lang) => {
  if (lang !== 'np') return parseFloat(text) || 0;
  
  const numberMap = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  
  const numericText = text.split('').map(char => numberMap[char] || char).join('');
  return parseFloat(numericText) || 0;
};

module.exports = {
  parseHTMLData,
  categorizeProduct,
  sortProducts,
  convertToNumber
};