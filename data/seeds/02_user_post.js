
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        { id: 1,
          postTitle: 'The Coolest neighbourhood: Sham Shui Po',
          postContent: 'My favourite place to take visitors to is Sham Shui Po, a Hong Kong hidden gem. This colourful Kowloon locality is one of the poorest of all the districts in Hong Kong and provides a stark contrast to the glitz and glam of the Central skyscrapers. Each street specialises in different goods, from kids clothes and suitcases, decorations to match the season, electronics of every kind, craft and jewelry making supplies and every fabric under the sun.',
          postAddress: 'Sham Shui Po',
          postDo: 'whatToSee',
          postGo: 'kowloon',
          postLat: '22.331030965255383',
          postLng: '114.16206545185044',
          postPhoto: 'https://i.imgur.com/QySqSg1.jpg',
          received_fav: 0,
          received_comments: 0,
          users_id: 2,
          users_username: "B L",
          users_userPhoto: 'https://lh6.googleusercontent.com/-B6YTv7vT8XQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnPXc3ogaMjnsN0U6soau9Zf6X-Sg/s96-c/photo.jpg',
          postDate: '10 November 2020'
        },
        { id: 2,
          postTitle: 'Hong Kong Tramways',
          postContent: 'The HK trams are also called “ding ding” because of the sound of the warning noise made to notify pedestrians of its presence is one of the moving landmarks of Hong Kong. It has been a form of commuter transport since 1904, and it’s a great way of travelling with locals who are in no hurry to go from point A to point B. Did you know that you could rent an open-top vintage tram for private parties? * Mind you, the HK trams only run on HK Island!',
          postAddress: 'Hong Kong Island',
          postDo: 'whatToSee',
          postGo: 'hkIsland',
          postLat: '22.283112572176904',
          postLng: '114.15689070171356',
          postPhoto: 'https://i.imgur.com/8woSiZB.jpg',
          received_fav: 0,
          received_comments: 0,
          users_id: 1,
          users_username: "Betty Bee",
          users_userPhoto: '../assets/png/049-worldwide.png',
          postDate: '10 November 2020'
        }
      ]);
    });
};
