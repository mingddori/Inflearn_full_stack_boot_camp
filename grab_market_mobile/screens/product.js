import axios from "axios";
import React, { useEffect, useState } from "react"
import {Image, ActivityIndicator, StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView} from "react-native"
import { API_URL } from "../config/constants";
import Avatar from "../assets/icons/avatar.png"
import dayjs from "dayjs"
import ProductCard from "../components/productCard";


export default function ProductScreen(props){

    const {id} = props.route.params;

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);


    const getProduct = () => {
        axios.get(`${API_URL}/products/${id}`)
        .then((result) => {
            setProduct(result.data.product);
        })
        .catch((error) => {
            console.error(error);
        })
    }

    const getRecommendedProduct = () => {
        axios.get(`${API_URL}/products/${id}/recommendation`)
        .then((result) => {
            setProducts(result.data.products);
        })
        .catch((error) => {
            console.error(error);
        })
    }


    useEffect(() => {
        getProduct();
        getRecommendedProduct();
    }, [id]);

    const onPressButton = () => {
        if(product.soldout !== 1) {
            axios.post(`${API_URL}/purchase/${id}`)
            .then((result) => {
                Alert.alert("구매가 완료되었습니다.");
                getProduct();
            })
            .catch((error) => {
                Alert.alert(`에러가 발생했습니다. ${error.message}`);
            })
        }
    }


    if(!product){
        return <ActivityIndicator />
    }


    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Image style={styles.productImage} source={{uri: `${API_URL}/${product.imageUrl}`}} resizeMode="contain" />
                </View>
                <View style={styles.productSection}>
                    <View style={styles.productSeller}>
                        <Image style={styles.avatarImage} source={Avatar} />
                        <Text>{product.seller}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>{product.price} 원</Text>
                        <Text style={styles.productDate}>{dayjs(product.createAt).format("YYYY년 MM월 DD일")}</Text>
                        <Text style={styles.productDescription}>{product.description}</Text>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.recommendationHeadline}>추천 상품</Text>
                    <View style={styles.recommendationSection}>
                        {products.map((product, index) => {
                            return (
                                <ProductCard product={product} key={index} navigation={props.navigation} />
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity onPress={onPressButton}>
                <View style={product.soldout ===1 ? styles.purchaseDisabled : styles.purchaseButton}>
                    <Text style={styles.purchaseText}>{product.soldout === 1 ? "구매완료" : "구매하기"}</Text>
                </View>
            </TouchableOpacity>
        </View>
            
    )
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    productImage: {
        width: "100%",
        height: 300
    },

    productSeller: {
        flexDirection: "row",
        alignItems: "center"
    },

    avatarImage: {
        width: 50,
        height: 50,
    },

    productSection: {
        padding: 16
    },

    divider: {
        backgroundColor: "#e9ecef",
        height: 1,
        marginVertical: 16
    },

    productName: {
        fontSize: 20,
        fontWeight: "400"
    },

    productPrice: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 8
    },

    productDate: {
        fontSize:14,
        marginTop: 4,
        color: "rgb(204,204,204)"
    },

    productDescription: {
        marginTop : 16,
        fontSize: 17,
        marginBottom : 32
    },

    purchaseButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: "rgb(255,80,88)",
        alignItems : "center",
        justifyContent: "center"
    },

    purchaseText : {
        color: "white",
        fontSize: 20,
    },

    purchaseDisabled: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: "gray",
        alignItems : "center",
        justifyContent: "center"

    },

    recommendationSection: {
        alignItems : "center",
        marginTop : 16,
        paddingBottom : 70
    },

    recommendationHeadline: {

        fontSize : 30,
    }



})