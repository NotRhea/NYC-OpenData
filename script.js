document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('container');
  const breedFilter = document.getElementById('breedFilter');
  const boroughFilter = document.getElementById('boroughFilter');
  const genderFilter = document.getElementById('genderFilter');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');
  const culpritWindow = document.getElementById('culpritWindow');
  const culpritTitle = document.getElementById('culpritTitle');
  const culpritImage = document.getElementById('culpritImage');
  const culpritDescription = document.getElementById('culpritDescription');
  const culpritInnerImage = document.getElementById('culpritInnerImage');
  let imageData = [];
  let currentPage = 0;
  const pageSize = 10;
  const randomImagePool = [
    "images/ball 3 .png",
    "images/ball1.png",
    "images/ball2.png",
    "images/ball5.png",
    "images/ball6.png",
    "images/ball7.png",
    "images/ball8.png",
    "images/bear.png",
    "images/bear2.png",
    "images/bear3.png",
    "images/bunny.png",
    "images/bunny2.png",
    "images/ducky.png",
    "images/elephant.png",
  ];
  
  const culpritImagePool = [
    "images/1000_F_267646018_rw9dR8s7oRNyUNKK5LUYQDyH6FfuhWJP.jpg",
    "images/criminal-mugshot-french-bulldog-dog-600nw-723693727.jpg.webp",
    "images/criminal-mugshot-pug-dog-police-260nw-723693706.jpg.webp",
    "images/mugshot-wanted-dog-holding-banner-600nw-133918412.jpg.webp",
    "images/prison-dog-960x540.jpg",
    "images/il_570xN.3144534229_4opu.jpg.avif",
    "images/ujphl.jpg",
    "images/Stupell-Industries-Funny-Boston-Terrier-Dog-Jail-Convicted-Police-Framed-Wall-Art-24-x-24-Design-by-Lucia-Heffernan_8eeaafb6-a31e-4a4b-86fd-dec218cf7242.0fe8be9c9c7691cdcc0d343bd6c2cfc7.jpeg",
    "images/Jail-2-400x330.jpg"
  ];

  const defaultCulpritImageUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fimages%2Fthe-dog-prisoner-in-a-bandana-with-a-gold-medallion-is-in-jail%2F267646018&psig=AOvVaw3JBANdaH0SlhYRsnGs5IQc&ust=1715309613350000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKCug7TI_4UDFQAAAAAdAAAAABAD";

  async function fetchData() {
    try {
      const response = await fetch('https://data.cityofnewyork.us/resource/rsgh-akpg.json?$query=SELECT%0A%20%20%60uniqueid%60%2C%0A%20%20%60breed%60%2C%0A%20%20%60gender%60%2C%0A%20%20%60spayneuter%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60zipcode%60%0AWHERE%0A%20%20(%60dateofbite%60%0A%20%20%20%20%20BETWEEN%20%222022-06-20T10%3A43%3A43%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20%20AND%20%222022-09-22T10%3A43%3A43%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20((%60borough%60%20IN%20(%22Manhattan%22%2C%20%22Brooklyn%22))%20AND%20(%60gender%60%20IN%20(%22U%22)))%0AORDER%20BY%20%60dateofbite%60%20ASC%20NULL%20LAST');
      if (response.ok) {
        const data = await response.json();
        imageData = data;
        renderItems();
        populateFilters();
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  function renderItems() {
    container.innerHTML = '';
    const filteredData = applyFilters();
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = filteredData.slice(startIndex, endIndex);
    currentPageData.forEach(item => {
      const itemContainer = document.createElement('div');
      itemContainer.classList.add('item');
      const img = document.createElement('img');
      img.src = getImageUrl(item.breed);
      img.alt = item.breed;
      img.classList.add('item-image');

      itemContainer.appendChild(img);
      container.appendChild(itemContainer);
      img.addEventListener('click', () => {
        const ouchMessage = document.createElement('div');
        ouchMessage.textContent = 'OUCH!';
        ouchMessage.classList.add('ouch-message');
        itemContainer.appendChild(ouchMessage);
        setTimeout(() => {
          itemContainer.removeChild(ouchMessage);
        }, 5000);

        culpritTitle.textContent = "THE CULPRIT";
        
        const randomIndex = Math.floor(Math.random() * culpritImagePool.length);
        culpritImage.src = culpritImagePool[randomIndex];
        culpritDescription.innerHTML = `
          <p>Unique ID: ${item.uniqueid}</p>
          <p>Breed: ${item.breed}</p>
          <p>Gender: ${item.gender}</p>
          <p>Spayed/Neutered: ${item.spayneuter ? 'Yes' : 'No'}</p>
          <p>Borough: ${item.borough}</p>
          <p>Zipcode: ${item.zipcode || 'N/A'}</p>
        `;
        
        culpritWindow.style.display = 'block';
       
        culpritInnerImage.src = defaultCulpritImageUrl; 
      });
    });

    updatePaginationButtons();
  }

  function getImageUrl(breed) {
    const randomIndex = Math.floor(Math.random() * randomImagePool.length);
    return randomImagePool[randomIndex];
  }

  function applyFilters() {
    const selectedBreed = breedFilter.value;
    const selectedBorough = boroughFilter.value;
    const selectedGender = genderFilter.value;
    return imageData.filter(item => {
      return (selectedBreed === '' || item.breed === selectedBreed) &&
             (selectedBorough === '' || item.borough === selectedBorough) &&
             (selectedGender === '' || item.gender === selectedGender);
    });
  }

  function populateFilters() {
    const breeds = [...new Set(imageData.map(item => item.breed))];
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed;
      option.textContent = breed;
      breedFilter.appendChild(option);
    });
    const boroughs = [...new Set(imageData.map(item => item.borough))];
    boroughs.forEach(borough => {
      const option = document.createElement('option');
      option.value = borough;
      option.textContent = borough;
      boroughFilter.appendChild(option);
    });
  }

  function updatePaginationButtons() {
    prevPageButton.disabled = currentPage === 0;
    const maxPageIndex = Math.ceil(applyFilters().length / pageSize) - 1;
    nextPageButton.disabled = currentPage === maxPageIndex;
  }

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderItems();
    }
  });

  nextPageButton.addEventListener('click', () => {
    const maxPageIndex = Math.ceil(applyFilters().length / pageSize) - 1;
    if (currentPage < maxPageIndex) {
      currentPage++;
      renderItems();
    }
  });

  breedFilter.addEventListener('change', () => {
    currentPage = 0;
    renderItems();
  });

  boroughFilter.addEventListener('change', () => {
    currentPage = 0;
    renderItems();
  });

  genderFilter.addEventListener('change', () => {
    currentPage = 0;
    renderItems();
  });

  fetchData();
});
