export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ProductType {
  CLOTHES = 'clothes',
  PASTELS = 'pastels',
}

export enum MediaFileAssociations {
  PRODUCTS = 'products',
  ORDERS = 'usage',
}

export enum MediaFileUsages {
  PHOTO = 'photo',
  CHECK = 'check',
}

export enum LangEnum {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en',
}

export enum PaymentType {
  CLICK = 'click',
  TERMINAL = 'terminal',
}

export enum DeliveryType {
  ONE_TWO_HOUR = 'one_two_hour',
  ONE_DAY = 'one_day',
  TWO_FIVE_DAYS = 'two_five_days',
}

export enum PatternType {
  COLOR = 'color',
  PATTERN = 'pattern',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELED = 'canceled',
}

export enum OrderStatus {
  NEW = 'new',
  APPROVED = 'approved',
  ON_DELIVERY = 'on_delivery',
  DONE = 'done',
  REJECTED = 'rejected',
}

export const ClickError = {
  Success: 0,
  SignFailed: -1,
  InvalidAmount: -2,
  ActionNotFound: -3,
  AlreadyPaid: -4,
  UserNotFound: -5,
  TransactionNotFound: -6,
  BadRequest: -8,
  TransactionCanceled: -9,
};

export const ClickAction = {
  Prepare: 0,
  Complete: 1,
};

export const TransactionActions = {
  Prepare: 0,
  Complete: 1,
};
