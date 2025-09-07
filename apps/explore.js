registerComponent(
  "6c89403b99c6448896ca159099fcab88",
  async function explore(doc, load) {
    const tableComponent = await load(
      doc,
      "/table.js",
      "63de6cee3a4642d8a04c810bbdf69654"
    );
    const css = doc.createElement("link");
    css.setAttribute("href", "/apps/explore.css");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    let currentPath = "";
    doc.head.appendChild(css);
    return function (components) {
      const table = tableComponent({ ...components });
      return async function (activeConnection) {
        function toHtml(text) {
          return text.replace(/\"/g, "&dquo;");
        }
        async function openItem(name) {
          openSet = [...openSet, name];
          async function onTabClose() {
            openSet = openSet.filter((x) => x !== name);
            await saveLastSet();
          }
          await saveLastSet();
          const fullValue = await activeConnection.getItem(name);
          async function onTabClick() {
            const element = itemTools.element.parentElement;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.style.boxShadow = "inset 0 0 4px 4px #ff0";
            await new Promise((r) => setTimeout(r, 140));
            element.style.boxShadow = "inset 0 0 4px 4px #fe0";
            await new Promise((r) => setTimeout(r, 130));
            element.style.boxShadow = "inset 0 0 4px 4px #fd0";
            await new Promise((r) => setTimeout(r, 120));
            element.style.boxShadow = "inset 0 0 4px 4px #fc0";
            await new Promise((r) => setTimeout(r, 110));
            
            element.style.boxShadow = "inset 0 0 4px 4px #fb0";
            await new Promise((r) => setTimeout(r, 100));
            element.style.boxShadow = "inset 0 0 4px 4px #fa0";
            await new Promise((r) => setTimeout(r, 1000));
            element.style.boxShadow = "";
          }
          const itemTools = toolbarRef.tab(
            JSON.stringify(name),
            onTabClose,
            onTabClick
          ).printer.html`
                <h3>View item</h3>
                <h4>${toHtml(JSON.stringify(name))}</h4>
                <section style="word-wrap: anywhere; white-space: preserve;">${fullValue}</section>
              `;
          const rawLink = document.createElement("a");
          rawLink.setAttribute("target", "_blank");
          rawLink.classList.add("raw");
          rawLink.textContent = "raw";
          const externalFlag = document.createElement("span");
          externalFlag.classList.add("external");
          externalFlag.textContent = "▜";
          rawLink.appendChild(externalFlag);
          rawLink.setAttribute("href", name);
          itemTools.element.firstElementChild.appendChild(rawLink);
          await components.notes(
            activeConnection,
            "@explore#notes",
            name,
            itemTools.tab("Notes").element
          );
        }
        
        async function openInFrame(name, isRestoration = false) {
          console.log('Opening iframe for:', name, 'isRestoration:', isRestoration);
          
          // Check if this iframe is already open to prevent duplicates during restoration
          if (isRestoration && openFrameSet.includes(name)) {
            console.log('Iframe already open, skipping restoration:', name);
            return;
          }
          
          // For manual opening, check if tab already exists in DOM
          if (!isRestoration) {
            const tabTitle = `Frame: ${JSON.stringify(name)}`;
            const existingTab = document.querySelector(`[data-tab-title="${tabTitle}"]`);
            if (existingTab) {
              console.log('Iframe tab already exists in DOM, skipping:', name);
              return;
            }
          }
          
          console.log('Creating iframe tab for:', name);
          
          // Add to openFrameSet only if not already present
          if (!openFrameSet.includes(name)) {
            openFrameSet = [...openFrameSet, name];
            console.log('Added to openFrameSet:', name);
          } else {
            console.log('Already in openFrameSet, not adding:', name);
          }
          console.log('Current openFrameSet:', openFrameSet);
          async function onTabClose() {
            openFrameSet = openFrameSet.filter((x) => x !== name);
            await saveLastSet();
          }
          await saveLastSet();
          
          async function onTabClick() {
            const element = itemTools.element.parentElement;
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.style.boxShadow = "inset 0 0 4px 4px #ff0";
            await new Promise((r) => setTimeout(r, 140));
            element.style.boxShadow = "inset 0 0 4px 4px #fe0";
            await new Promise((r) => setTimeout(r, 130));
            element.style.boxShadow = "inset 0 0 4px 4px #fd0";
            await new Promise((r) => setTimeout(r, 120));
            element.style.boxShadow = "inset 0 0 4px 4px #fc0";
            await new Promise((r) => setTimeout(r, 110));
            element.style.boxShadow = "inset 0 0 4px 4px #fb0";
            await new Promise((r) => setTimeout(r, 100));
            element.style.boxShadow = "inset 0 0 4px 4px #fa0";
            await new Promise((r) => setTimeout(r, 1000));
            element.style.boxShadow = "";
          }
          
          const itemTools = toolbarRef.tab(
            `Frame: ${JSON.stringify(name)}`,
            onTabClose,
            onTabClick
          ).printer.html`
            <h3>Frame View</h3>
            <h4>${toHtml(JSON.stringify(name))}</h4>
          `;
          
          console.log('Created iframe tab for:', name);
          console.log('Tab element:', itemTools.element);
          
          // Create iframe container
          const iframeContainer = document.createElement("div");
          iframeContainer.style.cssText = `
            width: 100%;
            height: 600px;
            border: 1px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
            background: white;
          `;
          
          // Create iframe
          const iframe = document.createElement("iframe");
          iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: white;
          `;
          
          // Construct proper URL for iframe
          const iframeUrl = name.startsWith('http') ? name : `${window.location.origin}/${name}`;
          iframe.src = iframeUrl;
          iframe.title = `Frame: ${name}`;
          
          console.log('Setting iframe src to:', iframeUrl);
          console.log('Window location origin:', window.location.origin);
          console.log('Name parameter:', name);
          
          // Check if this is a text file that shouldn't be loaded in iframe
          const isTextFile = name.endsWith('.js') || name.endsWith('.txt') || name.endsWith('.json') || name.endsWith('.md');
          if (isTextFile) {
            console.log('Detected text file, showing content instead of iframe');
            iframeContainer.innerHTML = `
              <div style="padding: 20px; text-align: center; color: #666;">
                <p>This is a text file: ${name}</p>
                <p>Text files cannot be displayed in iframes.</p>
                <p>Use "View item" instead to see the content.</p>
              </div>
            `;
            return;
          }
          
          // Add error handling to iframe
          iframe.onerror = function() {
            console.error('Iframe failed to load:', iframeUrl);
            iframeContainer.innerHTML = `
              <div style="padding: 20px; text-align: center; color: #666;">
                <p>Failed to load: ${iframeUrl}</p>
                <p>This might be a text file or the file doesn't exist.</p>
              </div>
            `;
          };
          
          iframe.onload = function() {
            console.log('Iframe loaded successfully:', iframeUrl);
          };
          
          // Add iframe directly to container
          iframeContainer.appendChild(iframe);
          
          // Add iframe container to the itemTools element
          itemTools.element.appendChild(iframeContainer);
          
          // Add controls
          const controls = document.createElement("div");
          controls.style.cssText = `
            margin-top: 10px;
            display: flex;
            gap: 10px;
            align-items: center;
          `;
          
          const refreshBtn = document.createElement("button");
          refreshBtn.textContent = "Refresh";
          refreshBtn.onclick = () => {
            iframe.src = iframe.src;
          };
          
          const newTabBtn = document.createElement("button");
          newTabBtn.textContent = "Open in New Tab";
          newTabBtn.onclick = () => {
            open(name, "_blank");
          };
          
          controls.appendChild(refreshBtn);
          controls.appendChild(newTabBtn);
          itemTools.element.appendChild(controls);
        }
        let showSystemEntries = false;
        let openSet = [];
        let openFrameSet = [];
        console.log('Initialized openFrameSet:', openFrameSet);
        let openLastSet =
          (await activeConnection.getItem("@explore#openLastSet")) === "open";
        
        // Initialize openFrameSet from storage if openLastSet is enabled
        if (openLastSet) {
          const storedFrameSet = JSON.parse(
            (await activeConnection.getItem("@explore#lastFrameSet")) ?? "[]"
          );
          openFrameSet = storedFrameSet;
          console.log('Restored openFrameSet from storage:', openFrameSet);
          console.log('openLastSet is:', openLastSet);
        } else {
          console.log('openLastSet is false, not restoring openFrameSet');
        }
        async function saveLastSet() {
          console.log('Saving last set. openLastSet:', openLastSet);
          console.log('openSet:', openSet);
          console.log('openFrameSet:', openFrameSet);
          if (openLastSet) {
            await activeConnection.setItem(
              "@explore#lastSet",
              JSON.stringify(openSet)
            );
            await activeConnection.setItem(
              "@explore#lastFrameSet",
              JSON.stringify(openFrameSet)
            );
            console.log('Saved both sets to storage');
          } else {
            await activeConnection.removeItem("@explore#lastSet");
            await activeConnection.removeItem("@explore#lastFrameSet");
            console.log('Removed both sets from storage');
          }
        }
        function itemFilter(item) {
          if (!showSystemEntries) {
            return !item.name.startsWith("@explore#");
          }
          return true;
        }
        let lastItemTableElement;
        let activeKeys =
          "keys" in activeConnection &&
          typeof activeConnection.keys === "function"
            ? await activeConnection.keys()
            : Object.keys(activeConnection);
        const element = doc.createElement("section");
        element.classList.add("app-explore");
        const printer = components.printer(element);
        //printer.text(
        //  `This is explore app, connected to ${activeConnection}. There ${((
        //    l
        //  ) => `${l === 1 ? "is" : "are"} ${l} item${l === 1 ? "" : "s"}`)(
        //    activeKeys.length
        //  )}.`
        //);
        const toolbarRef = printer.html`
          <p style="margin-bottom: 16px;">
            <a onclick=${() => createFile()}>+ file</a>
            <a onclick=${() => createFolder()}>+ folder</a>
          </p>
        `;
        toolbarRef.element.appendChild(
          components.select({
            async action(what) {
              showSystemEntries = what === "show";
              await reloadView();
            },
            options: [
              { value: "show", textContent: "Show system entries" },
              { value: "hide", textContent: "Do not show system entries" },
            ],
            selectedOption: showSystemEntries ? "show" : "hide",
          }).element
        );
        toolbarRef.element.appendChild(
          components.select({
            async action(what) {
              openLastSet = what === "open";
              await activeConnection.setItem("@explore#openLastSet", what);
              await saveLastSet();
            },
            options: [
              {
                value: "open",
                textContent: "Open last opened entries on startup",
              },
              { value: "none", textContent: "No entries open on startup" },
            ],
            selectedOption: openLastSet ? "open" : "none",
          }).element
        );
        const actions = [
          "",
          "open in new tab",
          "open in frame",
          "view",
          "edit",
          "copy",
          "delete",
        ];
        const columns = [
          "!table:star",
          "name",
          "size",
          "type",
          "value",
          "!table:action",
          "!table:pin",
        ];
        async function onAction(item, e) {
          const value = e.target.value;
          console.log("ACTION", value);
          switch (value) {
            case "":
              return;
            case "open in new tab":
              open(item.name, "_blank");
              break;
            case "open in frame":
              openInFrame(item.name);
              break;
            case "view":
              openItem(item.name);
              break;
            case "edit":
              async function submitEdit(e) {
                e.preventDefault();
                for (const inputElement of element.querySelectorAll("input")) {
                  inputElement.setAttribute("disabled", "disabled");
                }
                try {
                  const draftValue = e.target.elements.item(0).value;
                  await activeConnection.setItem(item.name, draftValue);
                  item.value = draftValue;
                  handleChange();
                  await reloadView();
                } catch (e) {
                  console.error(e);
                  for (const inputElement of element.querySelectorAll(
                    "input"
                  )) {
                    inputElement.removeAttribute("disabled");
                  }
                }
              }
              function handleChange() {
                const draftValue = element
                  .querySelector("form")
                  .elements.item(0).value;
                const saveButton = element.querySelector(
                  'input[type="submit"]'
                );
                if (draftValue === item.value) {
                  saveButton.disabled = true;
                  saveButton.disabled = false;
                  saveButton.disabled = true;
                  saveButton.setAttribute("disabled", "disabled");
                  saveButton.disabled = true;
                } else {
                  saveButton.removeAttribute("disabled");
                }
              }
              const editTab = toolbarRef.tab("Edit item");
              editTab.printer.text(
                `Edit item ${toHtml(JSON.stringify(item.name))}`
              );
              const { element } = editTab.printer.html`
                <form onsubmit=${submitEdit}>
                  <textarea name="value" value=${item.value} onkeyup=${handleChange} onchange=${handleChange} />
                  <input type="submit" value="Save" />
                </form>
              `;
              handleChange();
              break;
            case "copy":
              prompt(item.name, item.value);
              break;
            case "delete":
              if (confirm(`Really delete ${JSON.stringify(item.name)}?`)) {
                await activeConnection.removeItem(item.name);
              }
              await reloadView();
              break;
          }
          e.target.value = "";
        }
        async function itemIsPinned(item, pinType) {
          return activeConnection.getItem(
            `@explore#${pinType === "pin" ? "pinned" : "pin:" + pinType}:${
              item.name
            }`
          );
        }
        async function itemSetPinned(item, pinned, pinType) {
          const key = `@explore#${
            pinType === "pin" ? "pinned" : "pin:" + pinType
          }:${item.name}`;
          if (pinned) {
            return activeConnection.setItem(key, "1");
          } else {
            return activeConnection.removeItem(key);
          }
        }
        async function reloadView() {
          activeKeys =
            "keys" in activeConnection &&
            typeof activeConnection.keys === "function"
              ? await activeConnection.keys()
              : Object.keys(activeConnection);
          const itemTable = await table(
            activeConnection,
            activeKeys,
            actions,
            columns,
            onAction,
            itemIsPinned,
            itemSetPinned,
            itemFilter
          );
          if (lastItemTableElement) {
            element.removeChild(lastItemTableElement);
          }
          lastItemTableElement = itemTable.element;
          element.appendChild(itemTable.element);
        }
        const { createFile, createFolder } = await components.manageFolder(
          activeConnection,
          currentPath,
          (title) => toolbarRef.tab(title),
          reloadView
        );
        await reloadView();
        
        if (openLastSet) {
          console.log('Restoring last set. openLastSet:', openLastSet);
          const lastSet = JSON.parse(
            (await activeConnection.getItem("@explore#lastSet")) ?? "[]"
          );
          console.log('Restoring regular items:', lastSet);
          for (const item of lastSet) {
            console.log('About to restore regular item:', item);
            await openItem(item);
            console.log('Finished restoring regular item:', item);
          }
          
          // Add a small delay before restoring iframe tabs
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const lastFrameSet = JSON.parse(
            (await activeConnection.getItem("@explore#lastFrameSet")) ?? "[]"
          );
          console.log('Restoring iframe items:', lastFrameSet);
          console.log('Current openFrameSet before restoration:', openFrameSet);
          console.log('openLastSet during restoration:', openLastSet);
          
          for (const item of lastFrameSet) {
            console.log('About to restore iframe item:', item);
            await openInFrame(item, true); // Pass true for restoration
            console.log('Finished restoring iframe item:', item);
            console.log('openFrameSet after restoring item:', openFrameSet);
            // Add a small delay between iframe restorations
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Debug: Check what tabs are visible after restoration
          console.log('All tabs after restoration:', document.querySelectorAll('.tabs button'));
          console.log('Tab count:', document.querySelectorAll('.tabs button').length);
          console.log('Final openFrameSet:', openFrameSet);
        } else {
          console.log('Not restoring - openLastSet is false');
        }
        const e = {
          element,
        };
        return e;
      };
    };
  }
);
