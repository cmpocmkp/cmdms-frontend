/**
 * SVG Icons for Dashboard Module Cards
 * Extracted from old CMDMS dashboard modules
 */

export const ModuleIcons = {
  document: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3_1239)">
        <path
          d="M97.0703 76.5625H94.1406V16.9922C94.1406 15.3742 92.8289 14.0625 91.2109 14.0625H80.0781V2.92969C80.0781 1.31172 78.7664 0 77.1484 0H22.8516C21.2336 0 19.9219 1.31172 19.9219 2.92969V14.0625H8.78906C7.17109 14.0625 5.85938 15.3742 5.85938 16.9922V76.5625H2.92969C1.31172 76.5625 0 77.8742 0 79.4922V88.4863C0 94.835 5.16504 100 11.5137 100H88.4863C94.835 100 100 94.835 100 88.4863V79.4922C100 77.8742 98.6883 76.5625 97.0703 76.5625ZM25.7812 5.85938H74.2188V45.8984H59.1797C57.5617 45.8984 56.25 47.2102 56.25 48.8281V63.8672H25.7812V5.85938ZM70.0756 51.7578L62.1094 59.724V51.7578H70.0756ZM11.7188 19.9219H19.9219V66.7969C19.9219 68.4148 21.2336 69.7266 22.8516 69.7266H59.1797C59.9482 69.7268 60.7086 69.4117 61.2518 68.868L79.2195 50.9002C79.7637 50.3568 80.0787 49.5961 80.0781 48.8271V19.9219H88.2812V76.5625H66.2109C64.9547 76.5496 63.7748 77.4217 63.4123 78.6234L62.1461 82.4219H37.8539L36.5881 78.6246C36.226 77.4223 35.0459 76.5496 33.7893 76.5625H11.7188V19.9219ZM94.1406 88.4863C94.1406 91.6041 91.6041 94.1406 88.4863 94.1406H11.5137C8.3959 94.1406 5.85938 91.6041 5.85938 88.4863V82.4219H31.6773L32.9629 86.2779C33.3617 87.4742 34.4811 88.2812 35.7422 88.2812H64.2578C65.5188 88.2812 66.6383 87.4742 67.0371 86.2779L68.3227 82.4219H94.1406V88.4863Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  
  edit: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3_1153)">
        <path
          d="M96.8582 37.032C93.1541 33.9238 87.6115 34.4102 84.509 38.1074L76.1701 47.9752V19.3611C76.1701 16.9629 75.1729 14.6404 73.4342 12.9891L62.3057 2.41777C60.6652 0.859375 58.5156 0.000976562 56.2529 0.000976562H8.78887C3.94277 0.000976562 0 3.94375 0 8.78984V91.21C0 96.0561 3.94277 99.9988 8.78887 99.9988H67.3814C72.2275 99.9988 76.1703 96.0561 76.1703 91.21V75.202C76.5303 74.7756 97.8742 49.4936 97.9414 49.4141C101.064 45.693 100.58 40.1547 96.8582 37.032Z"
          fill="white"
        />
      </g>
    </svg>
  ),
  
  users: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="15" fill="white" />
      <circle cx="70" cy="30" r="15" fill="white" />
      <path d="M10 80 Q10 50 30 50 Q50 50 50 80 Z" fill="white" />
      <path d="M50 80 Q50 50 70 50 Q90 50 90 80 Z" fill="white" />
    </svg>
  ),
  
  award: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="40" r="20" fill="white" />
      <path d="M35 55 L30 90 L50 75 L70 90 L65 55 Z" fill="white" />
    </svg>
  ),
  
  flag: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="5" height="80" fill="white" />
      <path d="M25 10 L75 25 L25 40 Z" fill="white" />
    </svg>
  ),
  
  target: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="10" fill="white" />
    </svg>
  ),
  
  megaphone: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 30 L50 20 L50 70 L20 60 Z" fill="white" />
      <path d="M50 20 L80 30 L80 60 L50 70 Z" fill="white" />
      <rect x="15" y="30" width="10" height="30" fill="white" />
    </svg>
  ),
};

// Export type for icon names
export type ModuleIconName = keyof typeof ModuleIcons;
