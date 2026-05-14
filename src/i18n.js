const i18nextModule = globalThis.i18next
  ? { default: globalThis.i18next }
  : await import('../node_modules/i18next/dist/esm/i18next.js');

const i18next = i18nextModule.default;

const RESOURCES = {
  en: {
    translation: {
      page: {
        title: 'UNIQLO Inventory System',
      },
      header: {
        manageInventory: 'Manage Inventory',
        logoAlt: 'UNIQLO logo',
      },
      table: {
        caption: 'Inventory items with edit and delete controls.',
        colItemName: 'Item Name',
        colQuantity: 'Quantity',
        colType: 'Type',
        colUnitPrice: 'Unit Price',
        colTotalPrice: 'Total Price',
        colEdit: 'Edit',
        colDelete: 'Delete',
        searchPlaceholder: 'Search inventory',
        emptyTable: "Please select 'LOAD DATA' to load an existing database file or 'NEW DATA' to create a new one.",
      },
      toolbar: {
        addNewItem: 'ADD NEW ITEM',
        saveData: 'SAVE DATA',
        newData: 'NEW DATA',
        loadData: 'LOAD DATA',
      },
      nav: {
        mainNavigation: 'Main navigation',
        openInventoryPanel: 'Open inventory panel',
        openAnalyticsPanel: 'Open analytics panel',
        openCalendarPanel: 'Open calendar panel',
        openMessagesPanel: 'Open messages panel',
        openFilesPanel: 'Open files panel',
      },
      modal: {
        deleteTitle: 'Delete Confirmation',
        deleteBody: 'Are you sure you wish to remove this record?',
        deleteBtn: 'Delete',
        updateConfirmTitle: 'Update Confirmation',
        updateConfirmBody: 'Inventory has been successfully updated.',
        addConfirmTitle: 'Add Confirmation',
        addConfirmBody: 'A new item has been successfully added.',
        editTitle: 'Edit Data',
        editUpdateBtn: 'Update',
        addTitle: 'Add New Item',
        addBtn: 'Add',
        okBtn: 'OK',
        closeBtn: 'Close',
      },
      form: {
        labelItemName: 'Item Name',
        labelQuantity: 'Quantity',
        labelType: 'Type',
        labelUnitPrice: 'Unit Price',
        labelTotalPrice: 'Total Price',
        placeholder: 'Please enter a value.',
      },
      upload: {
        ariaLabel: 'Upload inventory data file',
      },
      tableAction: {
        editItem: 'Edit item',
        deleteItem: 'Delete item',
      },
      loading: {
        default: 'Please wait...',
        spinner: 'Loading...',
        openingForm: 'Opening form, please wait...',
        savingData: 'Saving data, please wait...',
        preparingNew: 'Preparing new data, please wait...',
        loadingData: 'Loading data, please wait...',
        openingDelete: 'Opening delete confirmation, please wait...',
        deletingItem: 'Deleting item, please wait...',
        openingEdit: 'Opening edit form, please wait...',
        updatingItem: 'Updating item, please wait...',
        addingItem: 'Adding item, please wait...',
      },
      error: {
        actionFailed: 'The action could not be completed. Please try again.',
        duplicateName: 'Error: Item name already exists! Please use a different name.',
        fileLoadFailed: 'The selected file could not be loaded. Please check the file and try again.',
        fileReadFailed: 'The selected file could not be read. Please try again.',
      },
      misc: {
        designAlert: 'Hi there! I added these buttons just for design because it looked kinda empty :3',
        emptyGifAlt: 'No inventory data loaded',
      },
      cookie: {
        bannerText: 'This site uses localStorage to save your inventory data and language preference between sessions. Do you consent to local storage use?',
        accept: 'Accept',
        decline: 'Decline',
        privacyLink: 'Privacy Policy',
      },
    },
  },
  zh: {
    translation: {
      page: {
        title: '优衣库库存管理系统',
      },
      header: {
        manageInventory: '库存管理',
        logoAlt: 'UNIQLO 标志',
      },
      table: {
        caption: '库存列表，含编辑和删除操作。',
        colItemName: '商品名称',
        colQuantity: '数量',
        colType: '类型',
        colUnitPrice: '单价',
        colTotalPrice: '总价',
        colEdit: '编辑',
        colDelete: '删除',
        searchPlaceholder: '搜索库存',
        emptyTable: "请点击'加载数据'以加载现有数据库文件，或点击'新建数据'创建新数据。",
      },
      toolbar: {
        addNewItem: '新增商品',
        saveData: '保存数据',
        newData: '新建数据',
        loadData: '加载数据',
      },
      nav: {
        mainNavigation: '主导航',
        openInventoryPanel: '打开库存面板',
        openAnalyticsPanel: '打开分析面板',
        openCalendarPanel: '打开日历面板',
        openMessagesPanel: '打开消息面板',
        openFilesPanel: '打开文件面板',
      },
      modal: {
        deleteTitle: '删除确认',
        deleteBody: '确定要删除此记录吗？',
        deleteBtn: '删除',
        updateConfirmTitle: '更新确认',
        updateConfirmBody: '库存已成功更新。',
        addConfirmTitle: '添加确认',
        addConfirmBody: '新商品已成功添加。',
        editTitle: '编辑数据',
        editUpdateBtn: '更新',
        addTitle: '新增商品',
        addBtn: '添加',
        okBtn: '确定',
        closeBtn: '关闭',
      },
      form: {
        labelItemName: '商品名称',
        labelQuantity: '数量',
        labelType: '类型',
        labelUnitPrice: '单价',
        labelTotalPrice: '总价',
        placeholder: '请输入值。',
      },
      upload: {
        ariaLabel: '上传库存数据文件',
      },
      tableAction: {
        editItem: '编辑商品',
        deleteItem: '删除商品',
      },
      loading: {
        default: '请稍候...',
        spinner: '加载中...',
        openingForm: '正在打开表单，请稍候...',
        savingData: '正在保存数据，请稍候...',
        preparingNew: '正在准备新数据，请稍候...',
        loadingData: '正在加载数据，请稍候...',
        openingDelete: '正在打开删除确认，请稍候...',
        deletingItem: '正在删除商品，请稍候...',
        openingEdit: '正在打开编辑表单，请稍候...',
        updatingItem: '正在更新商品，请稍候...',
        addingItem: '正在添加商品，请稍候...',
      },
      error: {
        actionFailed: '操作无法完成，请重试。',
        duplicateName: '错误：商品名称已存在！请使用其他名称。',
        fileLoadFailed: '所选文件无法加载，请检查文件后重试。',
        fileReadFailed: '所选文件无法读取，请重试。',
      },
      misc: {
        designAlert: '你好！这些按钮只是为了设计美观而添加的 :3',
        emptyGifAlt: '暂无库存数据',
      },
      cookie: {
        bannerText: '本网站使用 localStorage 在会话之间保存您的库存数据和语言偏好。您是否同意使用本地存储？',
        accept: '同意',
        decline: '拒绝',
        privacyLink: '隐私政策',
      },
    },
  },
};

const LANGUAGE_KEY = 'app.language';
const FALLBACK_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = new Set(['en', 'zh']);

function safeStorageGet(key) {
  const storage = globalThis.localStorage;
  if (!storage || typeof storage.getItem !== 'function') {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  const storage = globalThis.localStorage;
  if (!storage || typeof storage.setItem !== 'function') {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage write errors, e.g. private mode quota restrictions.
  }
}

function resolveInitialLanguage() {
  const stored = safeStorageGet(LANGUAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.has(stored)) {
    return stored;
  }

  return FALLBACK_LANGUAGE;
}

export async function initI18n() {
  if (i18next.isInitialized) {
    return i18next;
  }

  await i18next.init({
    lng: resolveInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    resources: RESOURCES,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
}

export async function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.has(lang)) {
    throw new Error(`Unsupported language: ${lang}`);
  }

  await initI18n();
  await i18next.changeLanguage(lang);
  safeStorageSet(LANGUAGE_KEY, lang);
  return i18next.language;
}

export function t(key, options = {}) {
  if (!i18next.isInitialized) {
    return key;
  }

  return i18next.t(key, options);
}

export async function getCurrentLanguage() {
  await initI18n();
  return i18next.language;
}

export { LANGUAGE_KEY, FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES };
