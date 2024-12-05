import axios from "axios";

export const getRandomQuote = async () => {
    try {
        const response = await axios.get("https://api.adviceslip.com/advice");

        return response.data.slip.advice;
    } catch (error) {
        console.error("Error fetching quote:", error);
        return "An error occurred while fetching the quote.";
    }
};
