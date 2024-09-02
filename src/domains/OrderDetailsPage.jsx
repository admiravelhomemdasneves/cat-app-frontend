import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, useTheme, Grid, TextField, IconButton, Autocomplete, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { tokens } from "../theme";
import { OrderDetailsStates }  from "../stores/OrderDetailsStore";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderDetailsPage = () => {
    const { idOrder } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { 
        completeOrderDTO,
        orderProducts,
        order,
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
    } = OrderDetailsStates(idOrder);

    const Header = ({clientName, orderName}) => {
        return (
            <Box>
                <Typography variant="h6" color="secondary" gutterBottom>
                    {"Order #" + idOrder + clientName}
                </Typography>

                <Typography variant="h3" color={colors.grey[100]} gutterBottom>
                    <span style={{ fontWeight: 'bold' }}> {orderName} </span> 
                </Typography>
            </Box>
        )
    }

    const DetailsAccordion = ({ accordionTitle, items = [] }) => {
        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    id="details-accordion-header"
                    aria-controls="details-accordion-content"
                    expandIcon={<ExpandMoreIcon />}
                    sx={{backgroundColor:colors.primary[400], borderRadius:"6px"}}
                >
                    <Typography variant="h5"> 
                        <span style={{ fontWeight: 'bold' }}> { accordionTitle } </span> 
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{borderRadius:"6px"}}>
                    <Box margin={2}>
                        <Grid 
                            container
                            spacing={2}
                        >
                            {items.map((item) => (
                                <>
                                    <Grid item xs={3}>
                                        <Typography variant="h6" justifyContent="center" alignContent="center">
                                            <span> {item.Title} </span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        {
                                            item.Editable ? (
                                                <Autocomplete
                                                    defaultValue={ item.Content }
                                                    options={ item.Options || []}
                                                    onChange={(event, newValue) => {
                                                        if (item.MutateMethod) { item.MutateMethod(newValue.id); };
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params}
                                                            //inputRef={input => input && input.focus()} 
                                                            variant="standard"
                                                        />
                                                    )}
                                                />
                                            )
                                            : (
                                                <Typography variant="h6" justifyContent="center">
                                                    <span> { item.Content } </span>
                                                </Typography>
                                            )
                                        }
                                    </Grid>
                                </>
                            ))}
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>
        )
    }

    const DisplayProducts = ({ orderProductsList = [] }) => {
        if (!Array.isArray(orderProductsList)) {
            console.error("Expected orderProductsList to be an array, but got:", orderProductsList);
            return null;
        }

        return (
            orderProductsList.map((product) => (
                <Accordion>
                    <AccordionSummary
                        sx={{backgroundColor:colors.primary[400], borderRadius:"6px"}}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <IconButton
                            size="small" 
                            aria-label="add" 
                            color={colors.grey[100]} 
                            style={{ marginTop: '-4px' }}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>

                        <Typography variant="h5"> 
                            <span style={{ fontWeight: 'bold' }}> # { product.getOrderProduct().getIdOrderProduct() } </span> 
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{borderRadius:"6px"}}>
                        <Grid container spacing={2}>
                            {/* ORDER PRODUCT DESCRIPTION */}
                            <Grid item xs={12}>
                                <TextField
                                    id="order-product-description"
                                    label="Description"
                                    variant="filled"
                                    fullWidth
                                    multiline
                                    maxRows={5}
                                    defaultValue={ product.getOrderProduct().getDescription() }
                                    onChange={(newValue) => {
                                        product.getOrderProduct().setDescription(newValue.target.value);
                                        updateOrderProduct(product.getOrderProduct());
                                    }}
                                />
                            </Grid>

                            {/* PRINTING SERVICES & PRODUCTS */}
                            <Grid item xs={10}>
                                {/* PRINTING SERVICES */}
                                <Autocomplete
                                    defaultValue={ 
                                        product.getOrderProduct().getPrintingService() ?
                                        product.getOrderProduct().getPrintingService().getName() : null
                                    }
                                    options={ printingServicesOptions || []}
                                    onChange={(event, newValue) => {
                                        console.log("newValue: ", newValue);
                                        updateOrderProductService(newValue.id, product.getOrderProduct());
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            //inputRef={input => input && input.focus()}
                                            label="Printing Service"
                                            variant="standard"
                                        />
                                    )}
                                />

                                {/* PRODUCTS */}
                                <Autocomplete
                                    defaultValue={ 
                                        product.getOrderProduct().getProduct() ? 
                                        product.getOrderProduct().getProduct().getProductType() + " - " + 
                                        product.getOrderProduct().getProduct().getBrand() + " - " + 
                                        product.getOrderProduct().getProduct().getName() 
                                        : null
                                    }
                                    options={ productsOptions || []}
                                    onChange={(event, newValue) => {
                                        updateOrderProductProduct(newValue.id, product.getOrderProduct());
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            //inputRef={input => input && input.focus()}
                                            label="Product"
                                            variant="standard"
                                        />
                                    )}
                                />
                            </Grid>

                            {/* PRODUCT IMAGE */}
                            <Grid item xs={2}>
                                <img src={`../../assets/user.png`} alt="Product" style={{ width: '100%', height: 'auto' }} />
                            </Grid>

                            {/* QUANTITIES, COLOR & SIZES*/}
                            <Grid item xs={12}>
                                <DisplaySpecs
                                    orderProduct={ product.getOrderProduct() }
                                    orderProductSpecs={ product.getOrderProductSpecs() }
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))
        )
    }

    const DisplaySpecs = ({ orderProduct = {}, orderProductSpecs = [] }) => {
        console.log("orderProductSpecs: ", orderProductSpecs);

        return (
            <Box>
                <Box display="flex" alignItems="center">
                    <Typography variant="h5" color={colors.grey[100]}> 
                        <span style={{ fontWeight: 'bold' }}> Product Specs </span> 
                    </Typography>
                    <IconButton 
                        size="small" 
                        aria-label="add-product" 
                        color={colors.grey[100]}
                        //onClick={ addNewOrderProductSpec(orderProduct) }
                    >
                        <AddCircleOutlineIcon fontSize="small"/>
                    </IconButton>
                </Box>
                {orderProductSpecs.map((spec) => (
                    <Grid container spacing={1}>
                        { /* QUANTITIES */ }

                        { /* SIZE */ }

                        { /* COLOR */ }
                    </Grid>
                ))}
            </Box>
        )
    }

    return (
        <Box m={2}>
            <Grid container spacing={2}>
                { /* PAGE HEADER */ }
                <Grid item xs={12}>
                    <Header
                        clientName={ " / " + contactName }
                        orderName={ orderName }
                    />
                </Grid>

                {/* LEFT SIDE */}
                <Grid item xs={8}>
                    <Grid container rowSpacing={2}>
                        {/* ORDER DESCRIPTION */}
                        <Grid item xs={12}>
                            <TextField
                                id="order-description"
                                variant="filled"
                                fullWidth
                                multiline
                                maxRows={10}
                                defaultValue={ orderDescription }
                                onChange={ (newValue) => { 
                                    updateDescription(newValue.target.value);
                                }}
                            />
                        </Grid>

                        { /* PRODUCT LIST HEADER */ }
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                                <Typography variant="h5" color={colors.grey[100]}> 
                                    <span style={{ fontWeight: 'bold' }}>List of Products</span> 
                                </Typography>
                                <IconButton 
                                    size="small" 
                                    aria-label="add-product" 
                                    color={colors.grey[100]}
                                    onClick={addNewOrderProduct}
                                >
                                    <AddCircleOutlineIcon fontSize="small"/>
                                </IconButton>
                            </Box>
                        </Grid>

                        { /* PRODUCT LIST */ }
                        <Grid item xs={12}>
                            <DisplayProducts
                                orderProductsList={ orderProducts }
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* RIGHT SIDE */}
                <Grid item xs={4}>
                    <Grid 
                        container
                        spacing={2}
                    >
                        {/* ORDER DETAILS */}
                        <Grid item xs={12}>
                            <DetailsAccordion
                                accordionTitle="Order Details"
                                items={[
                                    { 
                                        Title: "Status", 
                                        Content: orderStatusName, 
                                        Editable: true, 
                                        Options: orderStatusOptions,
                                        MutateMethod: updateStatus
                                    },
                                    { 
                                        Title: "Client", 
                                        Content: contactName, 
                                        Editable: true,
                                        Options: contactOptions,
                                        MutateMethod: updateContact
                                    },
                                    { 
                                        Title: "Priority", 
                                        Content: orderPriorityName, 
                                        Editable: true,
                                        Options: orderPriorityOptions,
                                        MutateMethod: updatePriority
                                    }
                                ]}
                            />
                        </Grid>

                        {/* CLIENT DETAILS */}
                        <Grid item xs={12}>
                            <DetailsAccordion
                                accordionTitle="Order Details"
                                items={[
                                    { 
                                        Title: "Client", 
                                        Content: contactName, 
                                        Editable: true,
                                        Options: contactOptions,
                                        MutateMethod: updateContact
                                    },
                                    { 
                                        Title: "Address", 
                                        Content: contactFullAddress, 
                                        Editable: false 
                                    },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>                
            </Grid>
        </Box>
    )
}

export default OrderDetailsPage;