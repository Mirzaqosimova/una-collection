import { OrderStatus } from 'src/common/types/enums';

export const ORDER_STATUSES = [
  {
    status: OrderStatus.NEW,
    message_uz: (orderId: number) =>
      `${orderId} raqamli buyurtmangiz qabul qilindi. Tez orada operatorimiz siz bilan bog'lanadi. https://unazerowaste.com`,
    message_en: (orderId: number) =>
      `Your order ${orderId} has been received. Our team will contact you shortly. https://unazerowaste.com`,
    message_ru: (orderId: number) =>
      `Заказ ${orderId} принят. Скоро свяжемся. https://unazerowaste.com`,
  },
  {
    status: OrderStatus.APPROVED,
    message_uz: (_orderId: number) =>
      `Buyurtmangiz tasdiqlandi va tayyorlanmoqda. Tez orada yetkazib beriladi. https://unazerowaste.com`,
    message_en: (_orderId: number) =>
      `Your order has been approved and is being prepared. It will be delivered soon. https://unazerowaste.com`,
    message_ru: (_orderId: number) =>
      `Заказ подтверждён, готовится. Скоро доставка. https://unazerowaste.com`,
  },
  {
    status: OrderStatus.ON_DELIVERY,
    message_uz: (_orderId: number) =>
      `Buyurtmangiz yetkazib berilmoqda. Iltimos, qabul qilishga tayyor bo'ling. https://unazerowaste.com`,
    message_en: (_orderId: number) =>
      `Your order is out for delivery. Please be ready to receive it. https://unazerowaste.com`,
    message_ru: (_orderId: number) =>
      `Ваш заказ передан в доставку. Пожалуйста, будьте готовы к получению. https://unazerowaste.com`,
  },
  {
    status: OrderStatus.DONE,
    message_uz: (orderId: number) =>
      `${orderId} raqamli buyurtmangiz muvaffaqiyatli yetkazildi. Xaridingiz uchun rahmat! https://unazerowaste.com`,
    message_en: (orderId: number) =>
      `Your order ${orderId} has been successfully delivered. Thank you for your purchase! https://unazerowaste.com`,
    message_ru: (orderId: number) =>
      `Ваш заказ ${orderId} успешно доставлен. Спасибо за покупку! https://unazerowaste.com`,
    // params: ['https://unazerowaste.com/'],
  },
  {
    status: OrderStatus.REJECTED,
    message_uz: (_orderId: number) =>
      `Buyurtmangiz rad etildi. Batafsil ma'lumot uchun biz bilan bog'laning. https://unazerowaste.com`,
    message_en: (_orderId: number) =>
      `Unfortunately, your order has been rejected. Please contact us for details. https://unazerowaste.com`,
    message_ru: (_orderId: number) =>
      `Заказ отклонён. Свяжитесь с нами. https://unazerowaste.com`,
  },
];
