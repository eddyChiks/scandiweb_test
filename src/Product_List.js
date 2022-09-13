import Layout from './Layout.js';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import $ from 'jquery';

export default function Product_List() {
    const navigate = useNavigate()
    const navigateToAdd = () => {
        navigate("/add-product")
    }
    const navigateHome = () => {
        navigate('/')
    }
    const button1 = { name: "ADD", action: navigateToAdd }
    const button2 = { name: "MASS DELETE", id: "delete-product-btn", form:"delete_form" }
    const [products, setProducts] = useState([])
    const [productsLoaded, setProductsLoaded] = useState(false)
    const [checked, setChecked] = useState([])
    const fetchData = async () => {
        try {
            let response = await fetch("https://scandiwebtestapp2022.000webhostapp.com/backend/");
            let json = await response.json();
            //return { success: true, data: json };
            setProducts(json)
            setProductsLoaded(true);
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    const handleSubmit = (e) => {
        $.ajax({
            type: "POST",
            url: "https://scandiwebtestapp2022.000webhostapp.com/backend/",
            data: {
                input: checked,
                action: "delete"
            },
            success(data) {
                console.log(data)
                setChecked([])

                fetchData()
            },
            error: function (xhr, status, error) {
                console.log("Error function")
                console.log(xhr.responseText)
            }
        })
    }
    const handleChange = (e) => {
        const value = e.target.value
        if (e.target.checked) {
            setChecked(previousState => {
                previousState.push(value)
                return previousState
            })
        }
        else {
            setChecked(previousState => {
                const index = previousState.indexOf(value)
                previousState.splice(index, 1)
                return previousState
            })
        }
    }
    useEffect(() => {
        (async () => {
            setProductsLoaded(false);
            let res = await fetchData();
        })();
    }, []);
    const type_enum = { "DVD": 0, "Furniture": 1, "Book": 2 }
    function get_spec(obj) {
        const specs = [() => { return ("Size: " + obj['size'] + " MB") },
            () => { return ("Dimension: " + obj['height'] + "x" + obj['width'] + "x" + obj['length']) }, () => { return ("Weight: " + obj['weight'] + "KG") }]
        return specs[type_enum[obj['product_type']]]()
    }
    var content = []
    for (let product of products) {
        content.push(
            <Col md={2} className="m-5 square border border-dark">
                <Row className="p-3">
                    <Col md={2}>
                        <form id="delete_form" onSubmit={handleSubmit}>
                            <input id={product['sku']} type="checkbox" className="delete-checkbox" value={product['sku']} onChange={handleChange} />
                        </form>
                    </Col>
                    <Col md={8} className="text-center">
                        <p>{product['sku']}</p>
                        <p>{product['name']}</p>
                        <p>{product['price']}$</p>
                        <p>{get_spec(product)}</p>
                    </Col>
                </Row>
            </Col>
        )
    }
    content = (
        <Row>
            {content}
        </Row>
    )

    return (
        <div>
            {productsLoaded ? (
                <Layout title="Product List" button1={button1} button2={button2} content={content} />
            ) :
                <p></p>
            }

        </div>

    );
}