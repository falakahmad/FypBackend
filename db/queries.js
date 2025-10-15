import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// -------------------------------------------------------------------------------------------------

export const symptomData = async (req) => {
  const { age, sex, phrase } = req.query;

  try {
    const response = await axios.get("https://api.infermedica.com/v3/search", {
      params: { phrase, "age.value": age, sex },
      headers: {
        "App-Id": process.env.APP_ID,
        "App-Key": process.env.APP_KEY,
      },
    });

    if (!response.data.length) {
      return {
        status: 404,
        message: "No symptoms found for this query.",
        symptoms: [],
      };
    }

    return {
      status: 200,
      message: "Symptoms fetched successfully",
      symptoms: response.data,
    };
  } catch (error) {
    console.error("Error fetching symptoms:", error.message);
    return {
      status: 500,
      message: `Error fetching symptoms: ${error.message}`,
    };
  }
};

export const predictionData = async (req) => {
  const { age, sex, evidence, interview_mode } = req.body;
  const interviewId = req.headers["interview-id"];

  // Quick-triage branch
  if (interview_mode === "triage") {
    try {
      const triageRes = await axios.post(
        "https://api.infermedica.com/v3/triage",
        { age, sex, evidence },
        {
          headers: {
            "App-Id": process.env.APP_ID,
            "App-Key": process.env.APP_KEY,
            "Interview-Id": interviewId,
          },
        }
      );
      const { urgency, has_emergency_evidence } = triageRes.data;
      return {
        status: 200,
        message: "Triage success",
        prediction: {
          urgency,
          has_emergency_evidence,
          conditions: [],
          should_stop: true,
        },
      };
    } catch (error) {
      console.error(
        "Error performing triage:",
        error.response?.data || error.message
      );
      return {
        status: 500,
        message: "Error performing triage",
        e: error.message,
      };
    }
  }

  // Full-diagnosis branch
  try {
    const payload = { age, sex, evidence };
    const response = await axios.post(
      "https://api.infermedica.com/v3/diagnosis",
      payload,
      {
        headers: {
          "App-Id": process.env.APP_ID,
          "App-Key": process.env.APP_KEY,
          "Interview-Id": interviewId,
        },
      }
    );
    return {
      status: 200,
      message: "Diagnosis success",
      prediction: response.data,
    };
  } catch (error) {
    console.error(
      "Error performing diagnosis:",
      error.response?.data || error.message
    );
    return {
      status: 500,
      message: "Error performing diagnosis",
      e: error.message,
    };
  }
};

// -----------FINEST ONE----------------------------------------
// export const symptomData = async (req) => {
//   const { age, sex, phrase } = req.query;

//   try {
//     const response = await axios.get(
//       `https://api.infermedica.com/v3/search?phrase=${phrase}&age.value=${age}&sex=${sex}`,
//       {
//         headers: {
//           "App-Id": process.env.APP_ID,
//           "App-Key": process.env.APP_KEY,
//         },
//       }
//     );

//     if (response.data.length === 0) {
//       return {
//         status: 404,
//         message: "No symptoms found for this query.",
//         symptoms: {},
//       };
//     } else {
//       return {
//         status: 200,
//         message: "Symptoms fetched successfully",
//         symptoms: response.data,
//       };
//     }
//   } catch (error) {
//     console.error("Error fetching symptoms:", error.message);
//     return {
//       status: 500,
//       message: `Error fetching symptoms: ${error.message}`,
//     };
//   }
// };

// export const predictionData = async (req) => {
//   const { age, sex, evidence } = req.body;
//   const interviewId = req.headers["interview-id"]; // ◀︎ Read our Interview-Id

//   try {
//     console.log("Diagnosis Request Payload:", { age, sex, evidence });

//     const response = await axios.post(
//       "https://api.infermedica.com/v3/diagnosis",
//       { age, sex, evidence },
//       {
//         headers: {
//           "App-Id": process.env.APP_ID,
//           "App-Key": process.env.APP_KEY,
//           "Interview-Id": interviewId, // ◀︎ Forward it
//         },
//       }
//     );

//     console.log("Diagnosis Response:", response.data);
//     return {
//       status: 200,
//       message: "Success",
//       prediction: response.data,
//     };
//   } catch (error) {
//     console.error(
//       "Error performing diagnosis:",
//       error.response?.data || error.message
//     );
//     return {
//       status: 500,
//       message: "Error performing diagnosis",
//       e: error.message,
//     };
//   }
// };
// -----------FINEST ONE----------------------------------------

// export const symptomData = async (req) => {
//   const { age, sex, phrase } = req.query;
//   // console.log("Fetching symptoms with params:", { age, sex, phrase });
//   try {
//     const response = await axios.get(
//       `https://api.infermedica.com/v3/search?phrase=${phrase}&age.value=${age}&sex=${sex}`,
//       {
//         headers: {
//           "App-Id": process.env.APP_ID,
//           "App-Key": process.env.APP_KEY,
//         },
//       }
//     );
//     // console.log("Symptoms API response:", response.data);
//     if (response.data.length === 0) {
//       return {
//         status: 404,
//         message: "No symptoms found for this query.",
//         symptoms: {}, // Return null
//       };
//     } else {
//       return {
//         status: 200,
//         message: "Symptoms fetched successfully",
//         symptoms: response.data, // Return the symptoms data
//       };
//     }
//   } catch (error) {
//     console.error("Error fetching symptoms:", error.message);
//     return { status: 500, message: "Error fetching symptoms:", e: e.message };
//   }
// };

// export const predictionData = async (req) => {
//   const { age, sex, evidence } = req.body;

//   try {
//     console.log("Diagnosis Request Payload:", { age, sex, evidence });

//     const response = await axios.post(
//       "https://api.infermedica.com/v3/diagnosis",
//       { age, sex, evidence },
//       {
//         headers: {
//           "App-Id": process.env.APP_ID,
//           "App-Key": process.env.APP_KEY,
//         },
//       }
//     );

//     console.log("Diagnosis Response:", response.data);
//     return {
//       status: 200,
//       message: "Success",
//       prediction: response.data,
//     };
//   } catch (error) {
//     console.error(
//       "Error performing diagnosis:",
//       error.response?.data || error.message
//     );
//     return {
//       status: 500,
//       message: "Error performing diagnosis",
//       e: error.message,
//     };
//   }
// };

// ---------------------------------------------------------------------------------------
