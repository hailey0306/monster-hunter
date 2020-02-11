[
  '{{repeat(5, 17)}}',
  { 
    img: 'http://via.placeholder.com/200/{{integer(700,999)}}/fff',
    id: '{{index()}}',
    firstName: '{{firstName()}} ',
    lastName:'{{surname()}}',
    username:function(){
      return 'user'+this.id;
    },
    email:function(){
      return this.username+'@gmail.com';
    },
    password:'pass',

    animals:
    [
        '{{repeat(7)}}',
        {          

          id: '{{index()}}',
          type: function (tags) {
            var monsterType = ['Lust', 'Gluttony', 'Greed','Sloth','Wrath','Envy','Pride'];
            return monsterType[this.id];},
          img: function(){
      return 'images/'+this.type+'.png';},
          intro:function (tags) {
      var monsterIntro = ['Lust is an inordinate craving for the pleasures of the body.', 'Gluttony is an inordinate desire to consume more than that which one requires.', 'Greed is the desire for material wealth or gain, ignoring the realm of the spiritual. It is also called Avarice or Covetousness.','Sloth is the avoidance of physical or spiritual work.','Wrath is manifested in the individual who spurns love and opts instead for fury. It is also known as Wrath.','Envy is the desire for others\' traits, status, abilities, or situation.','The Sin of Pride is said by some to the the foremost of the Seven Deadly Sins. Hubris is the gateway through all other sin enters the mortal soul. '];
          return monsterIntro[this.id];},
          locations:
          [
              '{{repeat(5, 8)}}',
              {
                id: '{{index()}}',
                date: '{{date(new Date(2017, 0, 1), new Date(), "YYYY-MM-dd hh:mm:ss")}}',
                lat: '{{floating(37.787607, 37.712578)}}',
                lng: '{{floating(-122.503927, -122.384111)}}',
                confession: '{{lorem(1, "paragraphs")}}'
              
               }
           ]
           loc_amount:function(){ return this.locations.length; }
         }
     ]
   }
  
]