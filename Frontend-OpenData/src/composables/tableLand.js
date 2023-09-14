import { onMounted, ref } from "vue";
import { Database } from "@tableland/sdk";
import { useToast } from "vue-toastification";

export const useTableLand = () => {
  const toaster = useToast();

  const loading = ref(false);
  const tableRef = ref("");

  let signer;

  onMounted(() => {
    const _tableRef = localStorage.getItem("table_land_name");
    tableRef.value = _tableRef ?? "";
  });

  const setSigner = (_signer) => {
    signer = _signer;
  };

  const createTable = async (tableName) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta } = await db
      .prepare(
        `CREATE TABLE ${tableName} (id integer primary key, Features text, dataRequest text, dataDialog text);`
      )
      .run();

    console.log("table has been created successfully", meta);

    // The table's `name` (tableRef) is in the format `{prefix}_{chainId}_{tableId}`
    const { name: _tableRef } = meta.txn;

    console.log("tableRef name", _tableRef);

    localStorage.setItem("tableRef", _tableRef);

    tableRef.value = _tableRef;

    loading.value = false;
    return _tableRef;
  };

  const getRows = async (db) => {
    loading.value = true;

    if (!db && signer) db = new Database({ signer });
    else {
      toaster.error("Please specify DB Instance or signer first");
      return null;
    }

    const { results } = await db
      .prepare(`SELECT * FROM ${tableRef.value};`)
      .all();

    loading.value = false;
    return results;
  };

  const getRowsCount = async (db) => {
    loading.value = true;

    if (!db && signer) db = new Database({ signer });
    else {
      toaster.error("Please specify DB Instance or signer first");
      return null;
    }

    const { results } = await db
      .prepare(`SELECT COUNT(*) as count FROM ${tableRef.value};`)
      .all();
    loading.value = false;
    return results?.length ? results[0].count : 0;
  };

  const insertIntoTable = async () => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta: insert } = await db
      .prepare(`INSERT INTO ${tableRef.value} (val) VALUES (?);`)
      .bind("marcus sample text " + Math.floor(Math.random() * 100))
      .run();

    const tx = await insert.txn.wait();
    console.log("after inserting record", tx);

    loading.value = false;
    return tx;
  };

  const tableLandFunctions = {
    createTable,
    insertIntoTable,
    getRows,
    getRowsCount,
  };

  return {
    loading,
    tableRef,
    setSigner,
    tableLandFunctions,
  };
};
