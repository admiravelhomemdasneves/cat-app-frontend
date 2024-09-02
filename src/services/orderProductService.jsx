import { getOrderProduct, getOrderProductById, getOrderProductByOrder, postOrderProduct, putOrderProduct, deleteOrderProduct } from '../controller/orderProductController';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrderProductEntity from '../entities/orderProductEntity';
import { QUERY_KEYS } from '../util/Constants';

const QUERY_KEY = QUERY_KEYS.ORDER_PRODUCT;

export function useGetOrderProduct() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getOrderProduct(),
  });
}

export function useGetOrderProductById(id) {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getOrderProductById(id),
  });
};

export function useGetOrderProductByOrder(id) {
    return useQuery({
      queryKey: [QUERY_KEY],
      queryFn: () => getOrderProductByOrder(id),
    });
  };

export const usePostOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product) => postOrderProduct(product),
    onSuccess: () => { queryClient.invalidateQueries(QUERY_KEY); },
  });
};

export const usePostNewOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order) => {
      postOrderProduct(new OrderProductEntity(
        null,
        order.toObject(),
        null,
        null,
        null
      ))
    },
    onSuccess: () => { queryClient.invalidateQueries(QUERY_KEY); },
  });
};

export const usePutOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product) => putOrderProduct(product),
    onSuccess: () => { queryClient.invalidateQueries(QUERY_KEY); },
  });
};

export const useDeleteOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteOrderProduct(id),
    onSuccess: () => { queryClient.invalidateQueries(QUERY_KEY); },
  });
};