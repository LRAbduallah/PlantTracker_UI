export const convertHexToImage = (hex:string) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    const blob = new Blob([new Uint8Array(bytes)], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    return url;
  };

  export function base64ToImageBlob(base64: string, mimeType = "image/png") {
    // Remove data URI prefix if present
    const base64Data = base64.replace(/^data:image\/(png|jpeg);base64,/, "");
  
    // Decode base64 string
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    const byteArray = new Uint8Array(byteNumbers);
  
    // Create a blob from the byte array
    return new Blob([byteArray], { type: mimeType });
  }