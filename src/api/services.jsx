const Services = {

    GET_ALL_CONTACTS : 'http://localhost:8080/contact',
    GET_ID_CONTACT : `http://localhost:8080/contact`,
    DELETE_ID_CONTACT : `http://localhost:8080/contact`,
    PUT_ID_CONTACT : 'http://localhost:8080/contact',

    GET_ALL_PRODUCTS : 'http://localhost:8080/product',
    GET_ID_PRODUCT : `http://localhost:8080/product`,
    DELETE_ID_PRODUCT : `http://localhost:8080/product`,
    PUT_ID_PRODUCT : 'http://localhost:8080/product',

    GET_ALL_ORDER_PRODUCTS : 'http://localhost:8080/orderProduct',
    GET_ID_ORDER_PRODUCT : `http://localhost:8080/orderProduct`,
    DELETE_ID_ORDER_PRODUCT : `http://localhost:8080/orderProduct`,
    PUT_ID_ORDER_PRODUCT : 'http://localhost:8080/orderProduct',

    GET_ALL_ORDER_PRODUCTS_SPECS : 'http://localhost:8080/orderProductSpecs',
    GET_ID_ORDER_PRODUCT_SPECS : `http://localhost:8080/orderProductSpecs`,
    DELETE_ID_ORDER_PRODUCT_SPECS : `http://localhost:8080/orderProductSpecs`,
    PUT_ID_ORDER_PRODUCT_SPECS : 'http://localhost:8080/orderProductSpecs',

    GET_ALL_ORDER_STATUS : 'http://localhost:8080/orderStatus',
    GET_ID_ORDER_STATUS : `http://localhost:8080/orderStatus`,
    DELETE_ID_ORDER_STATUS : `http://localhost:8080/orderStatus`,
    PUT_ID_ORDER_STATUS : 'http://localhost:8080/orderStatus',

    GET_ALL_ORDER_PRIORITY : 'http://localhost:8080/orderPriority',
    GET_ID_ORDER_PRIORITY : `http://localhost:8080/orderPriority`,
    DELETE_ID_ORDER_PRIORITY : `http://localhost:8080/orderPriority`,
    PUT_ID_ORDER_PRIORITY : 'http://localhost:8080/orderPriority',

    GET_ALL_PRINTING_SERVICE : 'http://localhost:8080/printingService',
    GET_ID_PRINTING_SERVICE : `http://localhost:8080/printingService`,
    DELETE_ID_PRINTING_SERVICE : `http://localhost:8080/printingService`,
    PUT_ID_PRINTING_SERVICE : 'http://localhost:8080/printingService',

    GET_ALL_ORDERS : 'http://localhost:8080/order',
    GET_ID_ORDER : `http://localhost:8080/order`,
    GET_COMPLETE_ID_ORDER : `http://localhost:8080/order/complete`,
    DELETE_ID_ORDER : `http://localhost:8080/order`,
    PUT_ID_ORDER : 'http://localhost:8080/order',

    FindAllRequest: async (service) => {
      try {
        const response = await fetch(service);
        const result = await response.json();
        return result; // Return the result to the caller
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to propagate it to the caller
      }
    },

    FindRequestById: async (service, id) => {
      try {
        const response = await fetch(service + `/${id}`, {method: "GET"});
        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error; // Re-throw the error to propagate it to the caller
      }
    },

    DeleteRequest: async (service, id) => {
    try {
        const response = await fetch(service + `/${id}`, {
        method: "DELETE",
        });

        if (!response.ok) {
        throw new Error(response.statusText);
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
        throw error; // Re-throw the error to propagate it to the caller
    }
    },

    SaveRequest: async (service, updatedRow) => {        
    try {
        await fetch(service, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(updatedRow),
        })
        .then((res) => res.json())
        .then((result) => {
            console.log("UPDATED ROW: ", updatedRow);
            console.log("PUT REQUEST RESPONSE: ", result);
        })
        .catch((err) => console.log("error"));
    } catch (error) {
        console.error("Error saving contact:", error);
        throw error; // Re-throw the error to propagate it to the caller
    }
    },
}

export default Services;