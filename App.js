import React from 'react'; 
import {View, Text,FlatList,ActivityIndicator,StyleSheet, Image ,PermissionsAndroid,Platform, Button} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import API from 'apisauce';

import {
  SkypeIndicator
} from 'react-native-indicators';

const baseUrl = 'https://openweathermap.org';

const APICall = API.create({
  baseURL: baseUrl
})

export default class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      currentLongitude: 'unknown',//Initial Longitude
      currentLatitude: 'unknown',//Initial Latitude
      weatherData: [ 
                  {Day: '', Day_temp: null, Day_status: ''}, 
                  {Day: '', Day_temp: null, Day_status: ''},
                  {Day: '', Day_temp: null, Day_status: ''},
                  {Day: '', Day_temp: null, Day_status: ''},
                  {Day: '', Day_temp: null, Day_status: ''},
      ],
      isLoading: true,
   }

  }
 
 componentDidMount = () => {

  try{
  APICall
  .get('data/2.5/forecast?lat=' + this.state.currentLatitude + '&' + 'lon='+ this.state.currentLongitude + '&' + 'appid=439d4b804bc8187953eb36d2a8c26a02')
  .then(response => {
   
    this.setState(prevState => {
      let weatherData = Object.assign({}, prevState.weatherData);  // creating copy of state variable weatherData
     
     console.log("mannnnnnu====>"+ weatherData.length)

     for(let i=0, j=0; i<=4;i++,j=j+8){
      weatherData[i].Day = response.data.list[j].dt_txt.slice(0, 10); 
      weatherData[i].Day_temp = response.data.list[j].main.temp; 
      weatherData[i].Day_status = response.data.list[j].weather[0].description;
     }
     
    return { weatherData };                                 // return new object weatherData object
    })
    this.setState({
      isLoading: false
    })
  
    return response;
  })
  .then(console.log)
} catch(error) {
    alert('error')
}


  var that =this;
  //Checking for the permission just after component loaded
  if(Platform.OS === 'ios'){
    this.callLocation(that);
  }else{
    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
            'title': 'Location Access Required',
            'message': 'This App needs to Access your location'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          that.callLocation(that);
        } else {
          alert("Permission Denied");
        }
      } catch (err) {
        alert("err",err);
        console.warn(err)
      }
    }
    requestLocationPermission();
  }    
 }
 callLocation(that){
  //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
       (position) => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          //getting the Longitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);
          //getting the Latitude from the location json
          that.setState({ currentLongitude:currentLongitude });
          //Setting state Longitude to re re-render the Longitude Text
          that.setState({ currentLatitude:currentLatitude });
          //Setting state Latitude to re re-render the Longitude Text
       },
       (error) => console.log(error.message),
       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    that.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change
        console.log(position);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
       that.setState({ currentLongitude:currentLongitude });
       //Setting state Longitude to re re-render the Longitude Text
       that.setState({ currentLatitude:currentLatitude });
       //Setting state Latitude to re re-render the Longitude Text
    });
 }

   
 componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
 }
 render() {
  const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9)
    return (
      <View style = {styles.container}>
        {this.state.isLoading && (
          <SkypeIndicator color='red' size= {100} />
          )}

       {!this.state.isLoading && ( 
       <View style = {styles.container}>
        
        <View>
          <Text style = {styles.boldText1}> Today </Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: 50}}>
          <Text style={{fontSize: 80, lineHeight: 100, color:'white',fontWeight: 'bold'}}> { this.state.weatherData[0].Day_temp }</Text>
          <Text style={{fontSize: 25, lineHeight: 40, color: 'white', fontWeight: 'bold'}}>°C</Text>
        </View>

        <View>
          <Text style={{justifyContent:'center',alignItems: 'center',marginTop:5,fontSize:30,color: 'white'}}>
              {this.state.weatherData[0].Day_status}
          </Text>
        </View>
        
        <View style={styles.button}>
            <Text style={styles.buttonText}>5-day forecast</Text>
          </View>
     
         
        <FlatList
        style={{marginTop:30}}
        key={keyGenerator.key}
          data={[
            {index:0, key: this.state.weatherData[0].Day, temp: this.state.weatherData[0].Day_temp, description: this.state.weatherData[0].Day_status},
            {index:1, key: this.state.weatherData[1].Day, temp: this.state.weatherData[1].Day_temp, description: this.state.weatherData[1].Day_status},
            {index:2, key: this.state.weatherData[2].Day, temp: this.state.weatherData[2].Day_temp, description: this.state.weatherData[2].Day_status},
            {index:3, key: this.state.weatherData[3].Day, temp: this.state.weatherData[3].Day_temp, description: this.state.weatherData[3].Day_status},
            {index:4, key: this.state.weatherData[4].Day, temp: this.state.weatherData[4].Day_temp, description: this.state.weatherData[4].Day_status},
          ]}
          
          renderItem={({item}) => 
            <View style={{flex:1,flexDirection: 'row', marginTop:0}}>
              <Text style={styles.item} >{item.key} </Text>
              <Text style={styles.item} > {item.temp} </Text>
              <Text style={styles.item} > {item.description} </Text>
            </View>
          }
      /> 
    </View>
    )}
    </View>
    )}
}


const styles = StyleSheet.create ({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    padding:10,
    color: 'white',
    backgroundColor:'black'
 },
 boldText1: {
  fontSize: 70,
  color: 'white',
  fontWeight:'bold',
  marginTop:40
},
 boldText: {
    fontSize: 100,
    color: 'white',
    marginBottom: 30
 },
 item: {
  padding: 10,
  fontSize: 18,
  height: 44,
  color: 'gold'
},
button: {
  width: 300,
  borderRadius: 40,
  alignItems: 'center',
  backgroundColor: '#2196F3',
  marginTop:90
},
buttonText: {
  textAlign: 'center',
  padding: 5,
  color: 'white',
  fontSize:30
}
})