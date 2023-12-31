import { onMounted, ref } from "vue";
import { Database } from "@tableland/sdk";
import { useToast } from "vue-toastification";
import { providers } from "ethers";

export const useTableLand = () => {
  const toaster = useToast();

  const loading = ref(false);
  const tableRef = ref("");

  let signer;

  onMounted(() => {
    const _tableRef = localStorage.getItem("tableRef");
    tableRef.value = _tableRef ?? "";
  });

  const setSigner = (_signer) => {
    signer = _signer;
  };

  const initSigner = () => {
    const provider = new providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  };

  const createTable = async (tableName) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta } = await db
      .prepare(
        `CREATE TABLE ${tableName} (id integer primary key, dataRequest text, dataDialog text, Features text, top_5_evm text, tx_by_chain text, dex text);`
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

  const getRows = async (_tableRef = undefined, db) => {
    loading.value = true;

    if (!db && signer) db = new Database({ signer });
    else {
      toaster.error("Please specify DB Instance or signer first");
      return null;
    }

    const { results } = await db
      .prepare(`SELECT * FROM ${_tableRef ?? tableRef.value};`)
      .all();

    loading.value = false;
    return results;
  };

  const getRowsByTitle = async (title, _tableRef = undefined, db) => {
    loading.value = true;

    if (!db && signer) db = new Database({ signer });
    else {
      toaster.error("Please specify DB Instance or signer first");
      return null;
    }

    const { results } = await db
      .prepare(
        `SELECT * FROM ${
          _tableRef ?? tableRef.value
        } WHERE dataRequest LIKE '${title}';`
      )
      .all();

    loading.value = false;
    return results;
  };

  const getRowsCount = async (_tableRef = undefined, db) => {
    loading.value = true;

    if (!db && signer) db = new Database({ signer });
    else {
      toaster.error("Please specify DB Instance or signer first");
      return null;
    }

    const { results } = await db
      .prepare(`SELECT COUNT(*) as count FROM ${_tableRef ?? tableRef.value};`)
      .all();
    loading.value = false;
    return results?.length ? results[0].count : 0;
  };

  const insertIntoTable = async (
    { features, dataRequest, dataDialog, top_5_evm, tx_by_chain, dex },
    _tableRef
  ) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${
          _tableRef ?? tableRef.value
        } (dataRequest, dataDialog, Features, top_5_evm, tx_by_chain, dex) VALUES (?, ?, ?, ?, ?, ?);`
      )
      .bind(dataRequest, dataDialog, features, top_5_evm, tx_by_chain, dex)
      .run();

    const tx = await insert.txn.wait();
    console.log("after inserting record", tx);

    loading.value = false;
    return tx;
  };

  const insertMultipleIntoTable = async (
    data,
    _tableRef,
    columns = "dataRequest, dataDialog, Features, top_5_evm, tx_by_chain, dex"
  ) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${
          _tableRef ?? tableRef.value
        } (${columns}) VALUES ${data};`
      )
      .run();

    const tx = await insert.txn.wait();
    console.log("after inserting record", tx);

    loading.value = false;
    return tx;
  };

  const updateDataDialogWithId = async (cid, rowId, _tableRef = undefined) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta: insert } = await db
      .prepare(
        `UPDATE ${
          _tableRef ?? tableRef.value
        } SET dataDialog = '${cid}' WHERE id = ${rowId};`
      )
      .run();

    const tx = await insert.txn.wait();
    console.log("after inserting record", tx);

    loading.value = false;
    return tx;
  };

  const updateDataDialogWithTitle = async (
    cid,
    title,
    _tableRef = undefined
  ) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta: insert } = await db
      .prepare(
        `UPDATE ${
          _tableRef ?? tableRef.value
        } SET dataDialog = '${cid}' WHERE dataRequest like '${title}';`
      )
      .run();

    const tx = await insert.txn.wait();
    console.log("after updating record", tx);

    loading.value = false;
    return tx;
  };

  const tempupdate = async (title1, title2, _tableRef = undefined) => {
    loading.value = true;

    const db = new Database({
      signer,
    });

    const { meta: insert } = await db
      .prepare(
        `UPDATE ${
          _tableRef ?? tableRef.value
        } SET dataRequest = '${title2}' WHERE dataRequest like '${title1}';`
      )
      .run();

    const tx = await insert.txn.wait();
    console.log("after updating record", tx);

    loading.value = false;
    return tx;
  };

  const tableLandFunctions = {
    createTable,
    insertIntoTable,
    insertMultipleIntoTable,
    updateDataDialogWithId,
    updateDataDialogWithTitle,
    getRows,
    getRowsByTitle,
    getRowsCount,
    initSigner,
    tempupdate,
  };

  return {
    loading,
    tableRef,
    setSigner,
    tableLandFunctions,
  };
};
