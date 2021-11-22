import React, { useState } from 'react'
import {
    View,
    TouchableOpacity,
    ImageBackground,
    StyleSheet
} from 'react-native'
import { Button, Text, Input } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const CreateScreen = ({ navigation }) => {

    //fotoğraf için gerekli değişken
    const [image, setImage] = useState('');

    //kamera ile çekilen fotoğrafı almak için
    const takePhotoFromCamera = () => {

        ImagePicker.openCamera({
            cropping: true
        }).then(image => {
            console.log(image);
            setImage(image.path);
            setStudent({ ...student, Image: image.path })


        });
    }
    //galeriden seçilen fotoğrafı almak için
    const choosePhotoFromLibrary = () => {

        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            console.log(image);
            setImage(image.path);
            setStudent({ ...student, Image: image.path })
            this.bs.current.snapTo(1);
        });
    }

    //Fotoğraf seçmek için tıklanıldığında alttan gelen menü
    renderInner = () => (
        <View style={styles.panel}>

            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Fotoğraf Yükle</Text>
                <Text style={styles.panelSubtitle}>Fotoğraf Seçiniz</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>Fotoğraf Çek</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>Kütüphaneden Seç</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => this.bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Vazgeç</Text>
            </TouchableOpacity>

        </View>
    );

    renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>

            </View>
        </View>
    );

    bs = React.createRef();
    fall = new Animated.Value(1);


    //kayıt edilecek öğrenci verilerini tutabilmek için değişken
    const [student, setStudent] = useState({
        name: '',
        age: '',
        school: '',
        department: '',
        type: 'student',
        Image: image,
    })

    //kayıt edildikten sonra inputların temizlenmesi için reset metodu
    const resetForm = () => {
        setStudent({
            name: '',
            age: '',
            school: '',
            department: '',
            type: 'student',
        })
    }


    //student değişkenini firestore'a add ile ekliyoruz.
    const createStudent = async (student) => {
        try {
            await firestore().collection('students').add(student)
            resetForm()
            navigation.navigate('Home')
        } catch (error) {
            console.log(error)
        }
    }

    //Bottomsheet alt kısımdan gelecek olan fotoğraf seçimi için gerekli menü diğer kısımlar ise fotoğraf seçimi giriş inputları
    return (
        <View style={{ flex: 1, paddingHorizontal: 15, margin: 5 }}>
            <BottomSheet
                ref={this.bs}
                snapPoints={[330, 0]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}
            />
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                    <View
                        style={{
                            margin: 5,
                            height: 100,
                            width: 100,
                            borderRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <ImageBackground
                            source={{
                                uri: image,
                            }}
                            style={{ height: 100, width: 100, borderWidth: 1, marginTop: 5, borderRadius: 5, borderColor: 'white' }}
                            imageStyle={{ borderRadius: 5 }}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Icon
                                    name="camera"
                                    size={35}
                                    color="#fff"
                                    style={{
                                        opacity: 0.7,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                />
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
                <Text style={styles.yukle}>Resim Yükle</Text>
            </View>

            <Text style={{ textAlign: 'center', marginBottom: 15 }}>Create a student</Text>
            <Input
                value={student.name}
                onChangeText={(name) => { setStudent({ ...student, name: name }) }}
                placeholder='Enter name'
                leftIcon={{ type: 'font-awesome', name: 'header' }}
            />
            <Input
                value={student.age}
                onChangeText={(age) => { setStudent({ ...student, age: age }) }}
                placeholder='Enter age'
                leftIcon={{ type: 'font-awesome', name: 'vcard' }}
            />
            <Input
                value={student.school}
                onChangeText={(school) => { setStudent({ ...student, school: school }) }}
                placeholder='Enter school'
                leftIcon={{ type: 'font-awesome', name: 'building-o' }}
            />
            <Input
                value={student.department}
                onChangeText={(department) => { setStudent({ ...student, department: department }) }}
                placeholder='Enter department'
                leftIcon={{ type: 'font-awesome', name: 'desktop' }}
            />
            <Button title='SEND' onPress={() => { createStudent(student) }} />
        </View>
    )
}

export default CreateScreen

const styles = StyleSheet.create({
    button: {
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#08cc97'


    },
    yukle: {
        margin: 10,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10,

    },

    yazi: {
        margin: 5,

    },

    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,

    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },

    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#08cc97',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },

});