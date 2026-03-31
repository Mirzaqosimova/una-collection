import { OrderStatus } from 'src/common/types/enums';

export const ORDER_STATUSES = [
  {
    status: OrderStatus.NEW,
    message_uz: (orderId: number) =>
      `${orderId} raqamli buyurtmangiz qabul qilindi. Tez orada operatorimiz siz bilan bog'lanadi. UNA eco collection`,
    message_en: (orderId: number) =>
      `Your order ${orderId} has been received. Our team will contact you shortly. UNA eco collection`,
    message_ru: (orderId: number) =>
      `Ваш заказ ${orderId} принят. В ближайшее время с вами свяжется оператор. UNA eco collection`,
  },
  {
    status: OrderStatus.APPROVED,
    message_uz: (_orderId: number) =>
      `Buyurtmangiz tasdiqlandi va tayyorlanmoqda. Tez orada yetkazib beriladi. UNA eco collection`,
    message_en: (_orderId: number) =>
      `Your order has been approved and is being prepared. It will be delivered soon. UNA eco collection`,
    message_ru: (_orderId: number) =>
      `Ваш заказ подтверждён и готовится к отправке. Скоро будет доставлен. UNA eco collection`,
  },
  {
    status: OrderStatus.ON_DELIVERY,
    message_uz: (_orderId: number) =>
      `Buyurtmangiz yetkazib berilmoqda. Iltimos, qabul qilishga tayyor bo'ling. UNA eco collection`,
    message_en: (_orderId: number) =>
      `Your order is out for delivery. Please be ready to receive it. UNA eco collection`,
    message_ru: (_orderId: number) =>
      `Ваш заказ передан в доставку. Пожалуйста, будьте готовы к получению. UNA eco collection`,
  },
  {
    status: OrderStatus.DONE,
    message_uz: (orderId: number) =>
      `${orderId} raqamli buyurtmangiz muvaffaqiyatli yetkazildi. Xaridingiz uchun rahmat! UNA eco collection`,
    message_en: (orderId: number) =>
      `Your order ${orderId} has been successfully delivered. Thank you for your purchase! UNA eco collection`,
    message_ru: (orderId: number) =>
      `Ваш заказ ${orderId} успешно доставлен. Спасибо за покупку! UNA eco collection`,
  },
  {
    status: OrderStatus.REJECTED,
    message_uz: (_orderId: number) =>
      `Buyurtmangiz rad etildi. Batafsil ma'lumot uchun biz bilan bog'laning. UNA eco collection`,
    message_en: (_orderId: number) =>
      `Unfortunately, your order has been rejected. Please contact us for details. UNA eco collection`,
    message_ru: (_orderId: number) =>
      `К сожалению, ваш заказ был отклонён. Свяжитесь с нами для уточнения деталей. UNA eco collection`,
  },
];
