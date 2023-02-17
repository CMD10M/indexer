1) download dependencies for indexer.js file

2) input your own provider URL in utils.js file

3) run indexer.js file

4) check webpage http://localhost:32889/minteditems

5) To fetch data on 'fancy frontend' you can use this: 

  const [testdata, settestdata] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
        const response = await fetch('http://localhost:32889/minteditems');
        const tokensMetadata = await response.json();
        settestdata(tokensMetadata);
    }
    fetchData();
}, [testdata]);

console.log('testdata',testdata);