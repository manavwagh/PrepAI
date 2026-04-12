import os
import resend
from typing import List, Optional

class NotificationService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
        if self.api_key:
            resend.api_key = self.api_key
        else:
            resend.api_key = None

    async def send_performance_report(self, to_email: str, candidate_name: str, report_link: str) -> bool:
        """
        Sends an email with the performance report link using Resend.
        """
        if not resend.api_key:
            print(f"Mocking email to {to_email}: Your report is ready at {report_link}")
            return True

        try:
            params = {
                "from": "Interview AI <onboarding@resend.dev>", # Replace with verified domain in production
                "to": [to_email],
                "subject": f"Interview Performance Report - {candidate_name}",
                "html": f"""
                    <h1>Hi {candidate_name},</h1>
                    <p>Your AI interview session has ended. We've analyzed your performance and generated actionable advice.</p>
                    <p>You can view your full report here: <a href="{report_link}">View Analytics</a></p>
                    <p>Best of luck with your preparation!</p>
                """
            }
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Resend Error: {e}")
            return False

notification_service = NotificationService()
