import { OrderStatus } from 'src/common/types/enums';

export const ORDER_STATUSES = [
  {
    status: OrderStatus.NEW,
    message_uz:
      "Buyurtmangiz qabul qilindi. Tez orada operatorimiz siz bilan bog'lanadi. Rahmat!",
    message_en:
      'Your order has been received. Our team will contact you shortly. Thank you!',
    message_ru:
      'Ваш заказ принят. В ближайшее время с вами свяжется оператор. Спасибо!',
  },
  {
    status: OrderStatus.APPROVED,
    message_uz:
      'Buyurtmangiz tasdiqlandi va tayyorlanmoqda. Tez orada yetkazib beriladi.',
    message_en:
      'Your order has been approved and is being prepared. It will be delivered soon.',
    message_ru:
      'Ваш заказ подтверждён и готовится к отправке. Скоро будет доставлен.',
  },
  {
    status: OrderStatus.ON_DELIVERY,
    message_uz:
      "Buyurtmangiz yetkazib berilmoqda. Iltimos, qabul qilishga tayyor bo'ling.",
    message_en:
      'Your order is out for delivery. Please be ready to receive it.',
    message_ru:
      'Ваш заказ передан в доставку. Пожалуйста, будьте готовы к получению.',
  },
  {
    status: OrderStatus.DONE,
    message_uz:
      'Buyurtmangiz muvaffaqiyatli yetkazildi. Xaridingiz uchun rahmat!',
    message_en:
      'Your order has been successfully delivered. Thank you for your purchase!',
    message_ru: 'Ваш заказ успешно доставлен. Спасибо за покупку!',
  },
  {
    status: OrderStatus.REJECTED,
    message_uz:
      "Afsuski, buyurtmangiz rad etildi. Batafsil ma'lumot uchun biz bilan bog'laning.",
    message_en:
      'Unfortunately, your order has been rejected. Please contact us for details.',
    message_ru:
      'К сожалению, ваш заказ был отклонён. Свяжитесь с нами для уточнения деталей.',
  },
];
