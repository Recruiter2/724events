import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  // on defini la varible last, utilisé dans le footer on calcule le dernier projet réalisé
  // on trie directement les events par date ; le dernier event est le plus recent
  const byDateDesc = data?.events.sort((evtA, evtB) =>
    //  les images desordoné sont ordonée par date desormais
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  ); 
  // on calcul le dernier event et on l'isole
  const last = byDateDesc?.[0];

  // so here comments for begginer b4 return can insert variable u need
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      // this is a trap the comment above disables helper that's why I struggling so much and didn't notice I need to import last value below 
      value={{ // here comment for beginner don't forget to export the value u defined above just b4 return
        data,
        error,
        last, // on oublie pas de préciser que l'on renvoi last pour que quand on l'importe ça soit dispo sinon il reste invisible
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
