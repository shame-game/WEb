import * as yup from 'yup';
import { VALIDATION_PATTERNS } from '../constants';

// Auth validation schemas
export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

// Booking validation schemas
export const bookingSchema = yup.object().shape({
  customerId: yup
    .number()
    .typeError('ID Khách hàng phải là một số')
    .required('ID Khách hàng là bắt buộc')
    .positive('ID Khách hàng phải là số dương')
    .integer('ID Khách hàng phải là số nguyên'),
  // New customer details
  fullName: yup
    .string()
    .required('Họ tên khách hàng là bắt buộc')
    .min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  phoneNumber: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(VALIDATION_PATTERNS.PHONE_VN, 'Số điện thoại không hợp lệ'),
  address: yup
    .string()
    .required('Vui lòng nhập địa chỉ'),
  roomId: yup
    .number()
    .typeError('ID Phòng phải là một số')
    .required('ID Phòng là bắt buộc')
    .positive('ID Phòng phải là số dương')
    .integer('ID Phòng phải là số nguyên'),
  // New room details
  roomNumber: yup
    .string()
    .required('Số phòng là bắt buộc'),
  roomTypeId: yup
    .number()
    .typeError('ID Loại phòng phải là một số')
    .required('ID Loại phòng là bắt buộc')
    .positive('ID Loại phòng phải là số dương')
    .integer('ID Loại phòng phải là số nguyên'),
  roomTypeName: yup
    .string()
    .required('Tên loại phòng là bắt buộc'),
  price: yup
    .number()
    .typeError('Giá phải là một số')
    .required('Giá là bắt buộc')
    .positive('Giá phải lớn hơn 0'),
  roomStatus: yup
    .string()
    .required('Trạng thái phòng là bắt buộc'),
  checkInTime: yup
    .date()
    .required('Thời gian nhận phòng là bắt buộc')
    .typeError('Thời gian nhận phòng không hợp lệ'),
  checkOutTime: yup
    .date()
    .required('Thời gian trả phòng là bắt buộc')
    .typeError('Thời gian trả phòng không hợp lệ')
    .min(
      yup.ref('checkInTime'),
      'Thời gian trả phòng phải sau thời gian nhận phòng'
    ),
  status: yup
    .string()
    .required('Trạng thái đặt phòng là bắt buộc'),
  // Invoice details
  totalAmount: yup
    .number()
    .typeError('Tổng số tiền phải là một số')
    .required('Tổng số tiền là bắt buộc')
    .min(0, 'Tổng số tiền phải lớn hơn hoặc bằng 0'),
  invoiceStatus: yup
    .string()
    .required('Trạng thái hóa đơn là bắt buộc')
  // Payment details for Invoice
  , paymentMethod: yup
    .string()
    .required('Phương thức thanh toán là bắt buộc'),
  paymentAmount: yup
    .number()
    .typeError('Số tiền thanh toán phải là một số')
    .required('Số tiền thanh toán là bắt buộc')
    .min(0, 'Số tiền thanh toán phải lớn hơn hoặc bằng 0'),
  paymentDate: yup
    .date()
    .required('Ngày thanh toán là bắt buộc')
    .typeError('Ngày thanh toán không hợp lệ'),  // BookingService details
  serviceId: yup
    .number()
    .typeError('ID dịch vụ phải là một số')
    .required('ID dịch vụ là bắt buộc')
    .positive('ID dịch vụ phải là số dương')
    .integer(),
  serviceName: yup
    .string()
    .required('Tên dịch vụ là bắt buộc'),
  servicePrice: yup
    .number()
    .typeError('Giá dịch vụ phải là một số')
    .required('Giá dịch vụ là bắt buộc')
    .min(0, 'Giá dịch vụ phải >= 0'),
  serviceDate: yup
    .date()
    .required('Ngày sử dụng dịch vụ là bắt buộc')
    .typeError('Ngày sử dụng dịch vụ không hợp lệ')
});

// Account validation schemas
export const accountSchema = yup.object().shape({
  username: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập')
    .matches(VALIDATION_PATTERNS.USERNAME, 'Tên đăng nhập từ 4-20 ký tự, chỉ chữ và số'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .matches(VALIDATION_PATTERNS.PASSWORD, 'Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa và 1 số'),
  displayName: yup
    .string()
    .required('Vui lòng nhập tên hiển thị')
    .min(2, 'Tên hiển thị tối thiểu 2 ký tự'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(VALIDATION_PATTERNS.PHONE_VN, 'Số điện thoại không hợp lệ'),
  roleId: yup
    .number()
    .required('Vui lòng chọn vai trò')
});

// User validation schema (alias for account schema)
export const userValidationSchema = accountSchema;

// Role validation schema
export const roleValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên vai trò')
    .min(2, 'Tên vai trò tối thiểu 2 ký tự'),
  description: yup
    .string()
    .required('Vui lòng nhập mô tả'),
  permissions: yup
    .array()
    .of(yup.string())
    .min(1, 'Vui lòng chọn ít nhất một quyền'),
  status: yup
    .string()
    .required('Vui lòng chọn trạng thái')
});

// Customer validation schemas
export const customerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Vui lòng nhập họ tên')
    .min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(VALIDATION_PATTERNS.PHONE_VN, 'Số điện thoại không hợp lệ'),
  address: yup
    .string()
    .required('Vui lòng nhập địa chỉ'),
  identityCard: yup
    .string()
    .required('Vui lòng nhập CMND/CCCD')
    .matches(VALIDATION_PATTERNS.IDENTITY_CARD, 'CMND/CCCD phải có 9 hoặc 12 số')
});

// Customer validation schema (alias)
export const customerValidationSchema = customerSchema;

// Room Type validation schemas
export const roomTypeSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên loại phòng'),
  description: yup
    .string()
    .required('Vui lòng nhập mô tả'),
  basePrice: yup
    .number()
    .required('Vui lòng nhập giá cơ bản')
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
});

// Room Type validation schema (alias)
export const roomTypeValidationSchema = roomTypeSchema;

// Room validation schemas
export const roomSchema = yup.object().shape({
  roomNumber: yup
    .string()
    .required('Vui lòng nhập số phòng')
    .min(1, 'Số phòng không được để trống')
    .matches(/^[A-Za-z0-9]+$/, 'Số phòng chỉ được chứa chữ và số'),
  floor: yup
    .number()
    .required('Vui lòng nhập số tầng')
    .min(1, 'Số tầng phải lớn hơn 0')
    .max(50, 'Số tầng không được vượt quá 50')
    .integer('Số tầng phải là số nguyên'),
  roomTypeId: yup
    .number()
    .required('Vui lòng chọn loại phòng')
    .typeError('Vui lòng chọn loại phòng'),
  status: yup
    .string()
    .required('Vui lòng chọn trạng thái')
    .oneOf(['available', 'occupied', 'maintenance', 'cleaning', 'out-of-order'], 'Trạng thái không hợp lệ'),
  description: yup
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự'),
  isActive: yup
    .boolean()
});

// Room validation schema (alias)
export const roomValidationSchema = roomSchema;

// Service validation schemas
export const serviceSchema = yup.object().shape({
  serviceName: yup
    .string()
    .required('Vui lòng nhập tên dịch vụ'),
  description: yup
    .string()
    .required('Vui lòng nhập mô tả'),
  price: yup
    .number()
    .required('Vui lòng nhập giá dịch vụ')
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
});

// Service validation schema (alias)
export const serviceValidationSchema = serviceSchema;

// Invoice validation schemas
export const invoiceSchema = yup.object().shape({
  bookingId: yup
    .number()
    .required('Vui lòng chọn booking'),
  taxAmount: yup
    .number()
    .min(0, 'Thuế phải lớn hơn hoặc bằng 0')
});

// Payment validation schemas
export const paymentSchema = yup.object().shape({
  invoiceId: yup
    .number()
    .required('Vui lòng chọn hóa đơn'),
  amount: yup
    .number()
    .required('Vui lòng nhập số tiền')
    .min(1, 'Số tiền phải lớn hơn 0'),
  paymentMethod: yup
    .string()
    .required('Vui lòng chọn phương thức thanh toán')
});

// Inventory validation schemas
export const inventorySchema = yup.object().shape({
  itemName: yup
    .string()
    .required('Vui lòng nhập tên vật tư'),
  quantity: yup
    .number()
    .required('Vui lòng nhập số lượng')
    .min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
  unit: yup
    .string()
    .required('Vui lòng nhập đơn vị'),
  supplier: yup
    .string()
    .required('Vui lòng nhập nhà cung cấp')
});

// Inventory validation schema (alias)
export const inventoryValidationSchema = inventorySchema;

// Stock adjustment validation schema
export const stockAdjustmentValidationSchema = yup.object().shape({
  type: yup
    .string()
    .required('Vui lòng chọn loại điều chỉnh'),
  quantity: yup
    .number()
    .required('Vui lòng nhập số lượng')
    .min(1, 'Số lượng phải lớn hơn 0'),
  reason: yup
    .string()
    .required('Vui lòng chọn lý do'),
  notes: yup
    .string()
});
