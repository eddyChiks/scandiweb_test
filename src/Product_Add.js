import * as React from 'react';
import { useState } from 'react';
import { Container, Form, Row , Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout.js';
import $ from "jquery";

export default function Product_Add() {

    const navigate = useNavigate();
    const navigateHome = () => {
        navigate('/')
    }
    const [state, setState] = useState({
        sku: "",
        name: "",
        price: "",
        product_type:null
    })
    const [specstate, setSpecstate] = useState({
        size: null,
        height: null,
        width: null,
        length: null,
        weight: null,
    })
    const [spec_input, setSpecinput] = useState("")
    React.useEffect(() => {
        //console.log(state)
        //console.log(specstate)
    })

    function removeKey(key) {
        const copy = specstate
        delete copy[key]
        setSpecstate(copy)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = { ...state, ...specstate }
        $.ajax({
            type: "POST",
            url: "https://scandiwebtestapp2022.000webhostapp.com/backend/",
            data: {
                input: data,
                action:"save"
            },
            success(data) {
                if (data['error']) {
                    console.log("Still error")
                    alert(data['error'])
                }
                else {
                    console.log("Everything ok")
                    navigateHome()
                }
            },
            error: function (xhr, status, error) {
                console.log("Error function")
                console.log(xhr.responseText)
            }
        })
    }
    function handleChangeType(e) {
        const type = e.target.value
        const type_enum = {"DVD":0, "Furniture":1,"Book":2}
        const type_inputs = [{ id: "size", label: "Size (MB)", description: "Please indicate size of your DVD in MB (megabytes)"},
                            [{ id: "height", label: "Height (CM)", description: "PLease indicate height of your piece of furniture in centimeters"}, { id: "width", label: "Width (CM)", description: "PLease indicate width of your piece of furniture in centimeters"}, { id: "length", label: "Length (CM)", description: "PLease indicate length of your piece of furniture in centimeters"}],
                            { id: "weight", label: "Weight (KG)", description: "PLease indicate weight of your book in kilograms"}
        ]
        var inputs = null
        if (Array.isArray(type_inputs[type_enum[type]])) {
            inputs = []
            for (let i of type_inputs[type_enum[type]]) {
                inputs.push(
                    <Form.Group as={Row} className="mb-3" controlId={i.id} key={i.id}>
                        <Col md={5}>
                            <Form.Label>{i.label}</Form.Label>
                        </Col>
                        <Col md={7}>
                            <Form.Control id={i.id} name={i.id} value={specstate[i.id]} onChange={handleSpecChange} type="number" step="0.01" required />
                        </Col>
                        <Form.Text className="text-muted">
                            {i.description}
                        </Form.Text>
                    </Form.Group>
                )
            }
        }
        else {
            inputs = (
                <Form.Group as={Row} className="mb-3" controlId={type_inputs[type_enum[type]]}>
                    <Col md={5}>
                        <Form.Label>{type_inputs[type_enum[type]].label}</Form.Label>
                    </Col>
                    <Col md={7}>
                        <Form.Control id={type_inputs[type_enum[type]].id} name={type_inputs[type_enum[type]].id} value={specstate[type_inputs[type_enum[type]].id]} onChange={handleSpecChange} type="number" step="0.01" required />
                    </Col>
                    <Form.Text className="text-muted">
                        {type_inputs[type_enum[type]].description}
                    </Form.Text>
                </Form.Group>)
        }
        setSpecinput(inputs)
        setState({
            ...state,
            [e.target.name]: type
        })
        setSpecstate("")
    }

    function handleChange(e) {
        const value = e.target.value
        setState({
            ...state,
            [e.target.name]: value
        })
    }

    function handleSpecChange(e){
        const value = e.target.value
        setSpecstate(previousState => {
            return {
                ...previousState,
                [e.target.name]: value
            }
        })
    }
    const button1 = { name: "Save", type: "submit", form: "product_form" }
    const button2 = { name: "Cancel", action: navigateHome }
    const content = (
        <Container id ="content">
            <Col md={3}>
            <Form id="product_form" onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="sku">
                    <Col md={3}>
                        <Form.Label>SKU</Form.Label>
                    </Col>
                        <Col md={9}>
                            <Form.Control id="sku" name="sku" value={state.sku} type="text" onChange={handleChange} required />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="name">
                    <Col md={3}>
                        <Form.Label>Name</Form.Label>
                    </Col>
                        <Col md={9}>
                            <Form.Control id="name" value={state.name} name="name" type="text" onChange={handleChange} required />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-5" controlId="price">
                    <Col md={3}>
                        <Form.Label>Price ($)</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control id="price" name="price" value={state.price} type="text" onChange={handleChange} required />
                    </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="type" className="mb-5">
                        <Col md={5}>
                            <Form.Label>Type Switcher</Form.Label>
                        </Col>
                        <Col md={7}>
                            <Form.Select value={state.product_type} name="product_type" id="productType" onChange={handleChangeType} required>
                                <option value="">Type Switcher</option>
                                <option value="DVD">DVD</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Book">Book</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Container id="blank">
                        {spec_input}
                    </Container>
            </Form>
            </Col>
        </Container>
    );
    return (
        <>
            <Layout title="Product Add" button1={button1} button2={button2} content={content} />
        </>
    );
}