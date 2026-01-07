def simulate_gemini_reasoning(prediction, context_string):
    """
    Simulates a Gemini 1.5 Pro Reasoning Layer.
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
