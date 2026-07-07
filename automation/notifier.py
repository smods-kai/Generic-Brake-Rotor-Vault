try:
    from plyer import notification

    def notify(title, message):
        notification.notify(
            title=title,
            message=message,
            app_name="RotorVault",
            timeout=5
        )

except Exception:

    def notify(title, message):
        print(f"[NOTIFICATION] {title}: {message}")