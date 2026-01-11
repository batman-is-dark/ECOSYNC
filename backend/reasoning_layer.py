import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def get_real_gemini_insight(actual, predicted, strategy_active=False):
    """
    Calls the actual Gemini API to generate strategic energy insights.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Gemini API Key missing. Please check your .env file."
        
    genai.configure(api_key=api_key)
    
    # Using gemini-1.5-flash for speed/cost balance
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are the EcoSync AI Strategic Advisor. 
    Current Campus Data:
    - Actual Occupancy: {actual}
    - Predicted Occupancy: {predicted}
    - Strategy Applied: {strategy_active}
    
    Provide a concise, 1-sentence professional insight or recommendation for campus energy management.
    Focus on sustainability, cost, or grid stability.
    Do not use markdown. Just the sentence.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Strategic analyzer offline. Using local predictive logic."

def simulate_gemini_reasoning(prediction, context_string):
    """
    Simulates a Gemini 2.5 Pro Reasoning Layer.
    Adjusts the occupancy forecast based on external context.
    """
    print(f"Original Prediction: {prediction}")
    print(f"Context: {context_string}")
    
    adjusted_prediction = prediction.copy()
    
    if "protest" in context_string.lower() or "event" in context_string.lower():
        # Increase occupancy forecast if there's a protest or event
        adjusted_prediction = [p * 1.5 for p in prediction]
        reasoning = "Increased forecast due to unplanned campus activity."
    elif "holiday" in context_string.lower() or "break" in context_string.lower():
        # Decrease occupancy forecast
        adjusted_prediction = [p * 0.2 for p in prediction]
        reasoning = "Decreased forecast due to campus holiday/break."
    else:
        reasoning = "No significant context adjustments applied."
        
    print(f"Reasoning: {reasoning}")
    print(f"Adjusted Prediction: {adjusted_prediction}")
    return adjusted_prediction, reasoning

if __name__ == "__main__":
    # Example usage
    sample_prediction = [150, 160]
    context = "Note: Today is an unplanned student protest"
    simulate_gemini_reasoning(sample_prediction, context)
