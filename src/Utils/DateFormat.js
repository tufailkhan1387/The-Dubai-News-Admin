// DateFormat.js
export function formatDate(dateInput) {
    // Create a Date object from the input
    const date = new Date(dateInput);
  
    // Get the day with leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0');
  
    // Array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Get the month name from the array
    const month = monthNames[date.getMonth()];
  
    // Get the full year
    const year = date.getFullYear();
  
    // Return the formatted date string
    return `${day}-${month}-${year}`;
  }
  