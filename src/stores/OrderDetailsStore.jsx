import { useState, useEffect } from "react";
import { useGetCompleteOrderInfoById, usePostOrder, usePutOrder } from "../services/orderService";
import { usePostNewOrderProduct, usePutOrderProduct } from "../services/orderProductService";
import { usePostNewOrderProductSpec } from "../services/orderProductSpecsService";
import { useGetPrintingServices } from "../services/printingServiceService";
import { useGetProducts } from "../services/productService";
import { useGetContact } from "../services/contactService";
import { useGetOrderPriority } from "../services/orderPriorityService";
import { useGetOrderStatus } from "../services/orderStatusService";
import Services from "../api/services";
import { randomInt } from "@mui/x-data-grid-generator";

const OrderDetailsStore = {
    orderProductSampleRow: {  id_order_product: randomInt(), order: {}, description: null, product: null, printingService: null},

    SaveOrder: async (order) => {
        await Services.SaveRequest(Services.PUT_ID_ORDER, order);
    },

    UpdateOrderDescription: async (description, idOrder) => {
        let order = await Services.FindRequestById(Services.GET_ID_ORDER, idOrder);
        order.description = description;
        await Services.SaveRequest(Services.PUT_ID_ORDER, order);
    },

    UpdateOrderStatus: async (idStatus, idOrder) => {
        const orderStatus = await Services.FindRequestById(Services.GET_ID_ORDER_STATUS, idStatus);
        let order = await Services.FindRequestById(Services.GET_ID_ORDER, idOrder);

        // Update the order object's orderStatus property with the fetched orderStatus object
        order.orderStatus = orderStatus;

        // Save/update the modified order object
        await Services.SaveRequest(Services.PUT_ID_ORDER, order);
    },
     
    UpdateOrderContact: async (idContact, idOrder) => {
        let order = await Services.FindRequestById(Services.GET_ID_ORDER, idOrder);

        if (idContact)
        {
            const contact = await Services.FindRequestById(Services.GET_ID_CONTACT, idContact);
            order.contact = contact;
        }
        else
        {
            order.contact = null;
        }

        // Save/update the modified order object
        await Services.SaveRequest(Services.PUT_ID_ORDER, order);
    },

    UpdateOrderPriority: async (idPriority, idOrder) => {
        const orderPriority = await Services.FindRequestById(Services.GET_ID_ORDER_PRIORITY, idPriority);
        let order = await Services.FindRequestById(Services.GET_ID_ORDER, idOrder);

        // Update the order object's orderStatus property with the fetched orderStatus object
        order.orderPriority = orderPriority;

        // Save/update the modified order object
        await Services.SaveRequest(Services.PUT_ID_ORDER, order);
    },

    UpdateOrderProductProduct: async (idProduct, idOrderProduct) => {
        const product = await Services.FindRequestById(Services.GET_ID_PRODUCT, idProduct);
        let orderProduct = await Services.FindRequestById(Services.GET_ID_ORDER_PRODUCT, idOrderProduct);

        orderProduct.product = product;

        await Services.SaveRequest(Services.PUT_ID_ORDER_PRODUCT, orderProduct);
    },

    UpdateOrderProductPrintingService: async (idPrintingService, idOrderProduct) => {
        const printingService = await Services.FindRequestById(Services.GET_ID_PRINTING_SERVICE, idPrintingService);
        let orderProduct = await Services.FindRequestById(Services.GET_ID_ORDER_PRODUCT, idOrderProduct);

        orderProduct.printingService = printingService;

        await Services.SaveRequest(Services.PUT_ID_ORDER_PRODUCT, orderProduct);
    },

    UpdateProductSpecs: async (specs) => {        
        await Services.SaveRequest(Services.PUT_ID_ORDER_PRODUCT_SPECS, specs);
    },

    UpdateProductSpecsColor: async (color, idSpecs) => {        
        let specs = await Services.FindRequestById(Services.GET_ID_ORDER_PRODUCT_SPECS, idSpecs);
        specs.color = color;
        await Services.SaveRequest(Services.PUT_ID_ORDER_PRODUCT_SPECS, specs);
    },

    UpdateProductSpecsSize: async (size, idSpecs) => {        
        let specs = await Services.FindRequestById(Services.GET_ID_ORDER_PRODUCT_SPECS, idSpecs);
        specs.size = size;
        await Services.SaveRequest(Services.PUT_ID_ORDER_PRODUCT_SPECS, specs);
    },

    UpdateProductSpecsQuantity: async (quantity, idSpecs) => {        
        let specs = await Services.FindRequestById(Services.GET_ID_ORDER_PRODUCT_SPECS, idSpecs);
        specs.quantity = quantity;
        await Services.SaveRequest(Services.PUT_ID_ORDER_PRODUCT_SPECS, specs);
    },
};

export const OrderDetailsStates = (idOrder) => {
        /* PAGE STATES INITIALIZATION */
    const [productsList, setProductsList] = useState([]);
    const [productsOptions, setProductsOptions] = useState([]);

    const [printingServicesList, setPrintingServicesList] = useState([]);
    const [printingServicesOptions, setPrintingServicesOptions] = useState([]);

    const [contactsList, setContactsList] = useState([]);
    const [contactOptions, setContactOptions] = useState([]);

    const [orderPrioritiesList, setOrderPrioritiesList] = useState([]);
    const [orderPriorityOptions, setOrderPriorityOptions] = useState([]);

    const [orderStatusList, setOrderStatusList] = useState([]);
    const [orderStatusOptions, setOrderStatusOptions] = useState([]);

    const [completeOrderDTO, setCompleteOrderDTO] = useState();

    const [orderProducts, setOrderProducts] = useState({});

    const [order, setOrder] = useState({});
    const [orderId, setOrderId] = useState();
    const [orderName, setOrderName] = useState("");
    const [orderDescription, setOrderDescription] = useState("");

    const [orderStatusName, setOrderStatusName] = useState("");

    const [orderPriorityName, setOrderPriorityName] = useState("");

    const [contactName, setContactName] = useState("");
    const [contactFullAddress, setContactFullAddress] = useState("");

    /* SERVICES INITIALIZATION */
    const { data : completeOrderData, error : completeOrderError } = useGetCompleteOrderInfoById( idOrder );

    const { data : productsData, error : productsError } = useGetProducts();
    const { data : printingServicesData, error : printingServicesError } = useGetPrintingServices();
    const { data : orderPriorityData, error : orderPriorityError } = useGetOrderPriority();
    const { data : contactData, error : contactError } = useGetContact();
    const { data : orderStatusData, error : orderStatusError } = useGetOrderStatus();

    const { mutate : mutatePostOrder } = usePostOrder();
    const { mutate : mutatePutOrder } = usePutOrder();
    const { mutate : mutateNewOrderProduct } = usePostNewOrderProduct();
    const { mutate : mutatePutOrderProduct } = usePutOrderProduct();
    const { mutate : mutateNewOrderProductSpec } = usePostNewOrderProductSpec();
    
        /* FETCH AUTOCOMPLETE OPTIONS*/
    useEffect(() => {
        if (printingServicesData) {
            setPrintingServicesList(printingServicesData);

            const formattedArray = [{ label: 'Empty', id: null }, ...printingServicesData.map(instance => ({
                label: instance.getName(),
                id: instance.getIdPrintingService()
            }))]

            setPrintingServicesOptions(formattedArray);
        } else if (printingServicesError) {
            console.log("printingServicesError: ", printingServicesError);
        };
    }, [printingServicesData, printingServicesError]);

    useEffect(() => {
        if (productsData) {
            setProductsList(productsData);

            const formattedArray = [{ label: 'Empty', id: null }, ...productsData.map(instance => ({
                label: instance.getProductType() + " - " + instance.getBrand() + " - " + instance.getName(),
                id: instance.getIdProduct()
            }))]

            setProductsOptions(formattedArray);
        } else if (productsError) {
            console.log("productsError: ", productsError);
        };
    }, [productsData, productsError]);

    useEffect(() => {
        if (contactData) {
            setContactsList(contactData);

            const formattedArray = [{ label: 'Empty', id: null }, ...contactData.map(instance => ({
                label: instance.getFullName(),
                id: instance.getIdContact()
            }))]

            setContactOptions(formattedArray);
        } else if (contactError) {
            console.log("contactError: ", contactError);
        };
    }, [contactData, contactError]);

    useEffect(() => {
        if (orderPriorityData) {
            setOrderPrioritiesList(orderPriorityData);

            const formattedArray = orderPriorityData.map(instance => ({
                label: instance.getName(),
                id: instance.getIdPriority()
            }))

            setOrderPriorityOptions(formattedArray);
        } else if (orderPriorityError) {
            console.log("orderPriorityError: ", orderPriorityError);
        };
    }, [orderPriorityData, orderPriorityError]);

    useEffect(() => {
        if (orderStatusData) {
            setOrderStatusList(orderStatusData);

            const formattedArray = [{ label: 'Empty', id: null }, ...orderStatusData.map(instance => ({
                label: instance.getName(),
                id: instance.getIdStatus()
            }))]

            setOrderStatusOptions(formattedArray);
        } else if (orderStatusError) {
            console.log("orderStatusError: ", orderStatusError);
        };
    }, [orderStatusData, orderStatusError]);

        /* FETCH FULL ORDER DTO */
    useEffect(() => {
        if (completeOrderData) {
            setCompleteOrderDTO(completeOrderData);
        } else if (completeOrderError) {
            console.log("completeOrderError: ", completeOrderError);
        };
    }, [completeOrderData, completeOrderError]);

        /* SET INDIVIDUAL STATES WHEN DTO CHANGES*/
    useEffect(() => {
        if (completeOrderDTO) {
            setVariables(completeOrderDTO);
            console.log("completeOrderDTO: ", completeOrderDTO);
        }
    }, [completeOrderDTO]);

        /* SET INDIVIDUAL STATES METHOD */
    const setVariables = (variables) => {
        setOrderProducts(variables.getOrderProducts());
        console.log("Order Products:", orderProducts);

        setOrder(variables.getOrder());
        setOrderId(variables.getOrder().getIdOrder());
        setOrderName(variables.getOrderName());
        setOrderDescription(variables.getOrderDescription());

        setOrderStatusName(variables.getOrderStatusName());

        setOrderPriorityName(variables.getOrderPriorityName());

        setContactName(variables.getContactFullName());
        setContactFullAddress(variables.getContactFullAddress());
    };

        /* HANDLES FOR DATA AND STATES MANIPULATION */
    const updateDescription = (description) => {
        order.setDescription(description);
        mutatePutOrder(order);
    };

    const updateOrderProduct = (product) => {
        mutatePutOrderProduct(product);
    }

    const updateOrderProductProduct = (id, orderProduct) => {
        const product = productsList.find(product => product.getIdProduct() === id);
        orderProduct.setProduct(product);
        mutatePutOrderProduct(orderProduct);
    }

    const updateOrderProductService = (id, orderProduct) => {
        const service = printingServicesList.find(service => service.getIdPrintingService() === id);
        orderProduct.setPrintingService(service);
        mutatePutOrderProduct(orderProduct);
    }

    const updateContact = async (id) => {
        const contact = contactsList.find(contact => contact.getIdContact() === id);
        order.setContact(contact);
        mutatePutOrder(order);
    };

    const updateStatus = async (id) => {
        const status = orderStatusList.find(status => status.getIdStatus() === id);
        order.setOrderStatus(status);
        mutatePutOrder(order);
    };

    const updatePriority = async (id) => {
        const priority = orderPrioritiesList.find(priority => priority.getIdPriority() === id);
        order.setOrderPriority(priority);
        mutatePutOrder(order);
    };

    const addNewOrderProduct = () => {
        if (order) {
            mutateNewOrderProduct(order);
        }
    };

    const addNewOrderProductSpec = (orderProduct) => {
            mutateNewOrderProduct(orderProduct);
    };

        /* RETURN ALL NECESSARY INFORMATION TO PAGE */
    return { 
        completeOrderDTO,
        orderProducts,
        order,
        orderId,
        orderName,
        orderDescription,
        updateDescription,
        addNewOrderProduct,
        contactName,
        orderStatusName,
        orderPriorityName,
        contactFullAddress,
        contactOptions,
        orderPriorityOptions,
        orderStatusOptions,
        productsOptions,
        printingServicesOptions,
        updateContact,
        updateStatus,
        updatePriority,
        updateOrderProduct,
        updateOrderProductProduct,
        updateOrderProductService,
        addNewOrderProductSpec
    };
}

export default OrderDetailsStore;