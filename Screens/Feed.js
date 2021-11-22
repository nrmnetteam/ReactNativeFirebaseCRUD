import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import { Card, Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { View, ScrollView, Image } from 'react-native'

//FireBase'e kayıtlı tüm öğrencileri listeleyen sayfadır
const Feed = ({ navigation }) => {
    const [students, setStudents] = useState([])

    //bu metot yardımı ile firestore'daki adı students olan collection daki veriler get edilmektedir. Daha sonra ise setStudents yardımı ile students'e yazılmaktadır.
    const fetchStudents = async () => {
        const studentsCollection = await firestore().collection('students').get()
        console.log(studentsCollection.docs)
        setStudents(
            studentsCollection.docs.map((doc) => {
                return { ...doc.data(), id: doc.id }
            })
        )
    }

    //Silme metodudur. doc(id) ile belirtilen id'li veri silinmektedir.
    const deleteStudent = async (id) => {
        const res = await firestore().collection('students').doc(id).delete()
        console.log(res)
        fetchStudents()
    }
    //güncellenen veri güncelleme ekranından sonra geri geldiğinde anlık olarak değişimlerin görüntülenebilmesi için gerekli yapıdır.
    useEffect(() => {
        firestore().collection('students').where("type", "==", "student").onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {

                fetchStudents()
            })
        })
    }, [])
    //Alt kısımda ise Card yapısı ile veriler bastırılmıştır.
    return (
        <View style={{ flex: 1 }}>
            <Header
                placement='left'
                centerComponent={{ text: 'STUDENTS', style: { color: '#fff', marginTop: 2 } }}
                leftComponent={{ icon: 'people', color: '#fff' }}
            />
            <ScrollView>
                {
                    students.map(student => {
                        return (
                            <Card key={student.id}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>

                                    <Image style={{ height: 100, width: 100 }} resizeMode="cover" source={{ uri: student.Image }} />
                                    <Card.Title style={{ fontSize: 21, color: 'red' }}>{student.name}</Card.Title>

                                </View>

                                <Card.Divider />
                                <Card.Title>{student.age} years old {student.department} student, studying
                                    at {student.school}

                                </Card.Title>
                                <Card.Divider />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Icon
                                        name='pencil'
                                        color={'blue'}
                                        size={20}
                                        onPress={() => {
                                            navigation.navigate('Update', {
                                                studentToUpdate: student
                                            })
                                        }}
                                    />
                                    <Icon
                                        name='trash'
                                        color={'red'}
                                        size={20}
                                        onPress={() => { deleteStudent(student.id) }}
                                    />
                                </View>
                            </Card>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

export default Feed
