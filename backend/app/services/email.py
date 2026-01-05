import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from decimal import Decimal
def send_order_confirmation_email(user_email: str, order_data: dict):
    # Cấu hình
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "thtnv9876@gmail.com"
    password = "ouiyjbrjpuuysmfy"
    # Tạo nội dung HTML cho danh sách sản phẩm
    items_html = ""
    for item in order_data["items"]:
        items_html += f"""
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">{item['title']}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">{item['quantity']}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{item['price']:,} đ</td>
        </tr>
        """
    html_content = f"""
    <html>
        <body>
            <h2 style="color: #0F9D58;">Xác nhận đơn hàng #{order_data['order_id']}</h2>
            <p>Chào bạn, đơn hàng của bạn đã được đặt thành công.</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f2fbf7;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Sản phẩm</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Số lượng</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Đơn giá</th>
                    </tr>
                </thead>
                <tbody>
                    {items_html}
                </tbody>
            </table>
            <p><strong>Phí vận chuyển:</strong> 30,000 đ</p>
            <h3 style="color: #primary;">Tổng thanh toán: {order_data['total_amount']:,} đ</h3>
            <p><strong>Địa chỉ giao hàng:</strong> {order_data['shipping_address']}</p>
            <p>Cảm ơn bạn đã mua sắm tại Nhà sách UTE!</p>
        </body>
    </html>
    """
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = user_email
    message["Subject"] = f"Xác nhận đơn hàng thành công #{order_data['order_id']}"
    message.attach(MIMEText(html_content, "html"))
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, user_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Lỗi gửi mail: {e}")
        return False