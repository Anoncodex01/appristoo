interface ShareData {
  title: string;
  text: string;
  url: string;
}

export const shareProduct = async (data: ShareData): Promise<boolean> => {
  // Check if the Web Share API is supported and if we're in a secure context
  if (!navigator.share || !window.isSecureContext) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Sharing failed:', error.message);
    }
    return false;
  }
};