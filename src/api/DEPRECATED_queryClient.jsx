import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CRUD_OPERATIONS } from '../util/Constants';
import apiClient from './apiClient';

const useCentralQuery = (queryKey, endpoint) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      try {
        const response = await apiClient.get(endpoint);
        return response.data;
      } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
      }
    },
  });
};

const useCentralMutation = (queryKey, endpoint, method = CRUD_OPERATIONS.GET) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      switch (method) {
        case CRUD_OPERATIONS.POST:
          await apiClient.post(endpoint, data).then(res => console.log("Posted data: ", data));
          break;
        case CRUD_OPERATIONS.PUT:
          await apiClient.put(endpoint, data).then(res => console.log("Put data: ", data));
          break;
        case CRUD_OPERATIONS.DELETE:
          await apiClient.delete(endpoint).then(res => console.log("Deleted data: ", endpoint));
          break;
        default:
          console.log("No available method for request");
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.log('Error on request: ', error);
    }
  });
};

export { useCentralQuery, useCentralMutation };
