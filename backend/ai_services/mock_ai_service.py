class MockAIService:
    @staticmethod
    def generate_visit_insights(notes):
        """
        Simulate AI analysis of visit notes.
        - Generate a mocked AI summary
        - Generate follow-up recommendation
        - Generate risk flag based on simple rules
        """
        notes_lower = notes.lower()
        
        # Simple rule-based "AI"
        summary = f"AI Summary: The agent reported: '{notes[:50]}...'"
        
        recommendation = "Regular follow-up"
        if "follow up" in notes_lower or "revisit" in notes_lower:
            recommendation = "Schedule revisit within 48 hours"
        elif "call" in notes_lower:
            recommendation = "Phone call follow-up required"

        risk_flag = "LOW"
        if "urgent" in notes_lower or "danger" in notes_lower or "critical" in notes_lower:
            risk_flag = "HIGH"
        elif "warning" in notes_lower or "issue" in notes_lower:
            risk_flag = "MEDIUM"

        return {
            "summary": summary,
            "recommendation": recommendation,
            "risk_flag": risk_flag
        }
