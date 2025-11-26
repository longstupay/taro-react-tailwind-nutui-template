export const generateMarketingCopy = async (
  title: string,
  type: string,
  keyDetails: string
): Promise<string> => {
  console.log(`Generating mock marketing copy for: ${title}, Type: ${type}, Details: ${keyDetails}`);
  
  // Return a generic mock description
  const mockCopy = `【限时特惠】${title}！${keyDetails} 不要错过，快来抢购吧！`;
  
  return Promise.resolve(mockCopy);
};
