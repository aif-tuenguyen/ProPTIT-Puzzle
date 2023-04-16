import { DeliveryStatus, OrderStatus, PaymentStatus } from 'src/models/order';
import { ProductStatus } from 'src/models/product';

export const clearLocalStorage = () => {
  localStorage.clear();
};

export enum PageType {
  CREATE = 'create',
  EDIT = 'edit',
  DETAIL = 'detail',
  LIST = 'list'
}

export const getPageType = (url: string): string => {
  if (!url) return '';
  const splitUrl = url.split('/');
  const page =
    Object.values(PageType).find((type) => splitUrl.includes(type)) || '';
  return page;
};

export const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

interface IContentByPageParams {
  createText: string;
  editText: string;
  detailText: string;
}

export const getContentByPage = (
  pageType: string,
  params: IContentByPageParams
) => {
  switch (pageType) {
    case PageType.CREATE:
      return params.createText;
    case PageType.EDIT:
      return params.editText;
    default:
      return params.detailText;
  }
};

export const getLabelStatus = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.STOCK:
      return {
        label: 'Còn hàng',
        color: 'success'
      };
    case ProductStatus.INCOMMING:
      return {
        label: 'Sắp có hàng',
        color: 'warning'
      };
    case ProductStatus.SOLD_OUT:
      return {
        label: 'Hết hàng',
        color: 'error'
      };
    default:
      return {
        label: '',
        color: ''
      };
  }
};

export const getLabelStatusOrder = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.OPEN:
      return {
        label: 'Chờ xác nhận',
        color: 'warning'
      };
    case OrderStatus.CONFIRMED:
      return {
        label: 'Đã xác nhận',
        color: 'info'
      };
    case OrderStatus.COMPLETED:
      return {
        label: 'Đã hoàn thành',
        color: 'success'
      };
    case OrderStatus.CANCELLED:
      return {
        label: 'Đã hủy',
        color: 'error'
      };
    default:
      return {
        label: '',
        color: ''
      };
  }
};

export const getLabelStatusShipment = (status: DeliveryStatus) => {
  switch (status) {
    case DeliveryStatus.UNFULFILLED:
      return {
        label: 'Không hoàn thành',
        color: 'error'
      };
    case DeliveryStatus.COLLECTED:
      return {
        label: 'Đã lấy hàng',
        color: 'info'
      };
    case DeliveryStatus.SHIPPED:
      return {
        label: 'Đã giao hàng',
        color: 'success'
      };
    case DeliveryStatus.SHIPPING:
      return {
        label: 'Đang giao hàng',
        color: 'warning'
      };
    case DeliveryStatus.ARRIVED:
      return {
        label: 'Đang tới nơi',
        color: 'warning'
      };
    case DeliveryStatus.RETURNED:
      return {
        label: 'Đã trả lại',
        color: 'error'
      };
    default:
      return {
        label: 'Đang trả lại',
        color: 'warning'
      };
  }
};

export const getLabelStatusPayment = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.UNPAID:
      return {
        label: 'Chưa thanh toán',
        color: 'secondary'
      };
    case PaymentStatus.PAID:
      return {
        label: 'Đã thanh toán',
        color: 'success'
      };
    case PaymentStatus.EXPIRED:
      return {
        label: 'Hết hạn thanh toán',
        color: 'error'
      };
    case PaymentStatus.FAILED:
      return {
        label: 'Thanh toán thất bại',
        color: 'error'
      };
    case PaymentStatus.REFUNDED:
      return {
        label: 'Đã hoàn tiền',
        color: 'info'
      };
    default:
      return {
        label: 'Đang hoàn tiền',
        color: 'warning'
      };
  }
};
