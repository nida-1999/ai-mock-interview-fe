import axios from "axios";

export async function startSession() {
  try {
    const response = await axios.get(`/api/main?path=start-new-session-1`);
    console.log(response, "response");
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch interview question:",
      error?.response?.data || error.message
    );
    throw error;
  }
}

// export const fetchQuestion = async (
//   questionId?: number
// ): Promise<QuestionData> => {
//   // Use mock data since API endpoint returns HTML instead of JSON
//   console.log("Using mock question data since API endpoint is not available");

//   // Simulate API delay

//   return {
//     questionId: 1,
//     questionTitle: "Two Sum",
//     questionDescription:
//       "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
//     constraints: [
//       "2 ≤ nums.length ≤ 10⁴",
//       "-10⁹ ≤ nums[i] ≤ 10⁹",
//       "-10⁹ ≤ target ≤ 10⁹",
//       "Only one valid answer exists.",
//     ],
//     example: {
//       input: "nums = [2,7,11,15], target = 9",
//       output: "[0,1]",
//     },
//     hints: [
//       "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
//       "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?",
//       "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?",
//     ],
//     tags: ["Array", "Hash Table"],
//     difficulty: "Easy",
//   };
// };
