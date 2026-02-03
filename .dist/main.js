const API_URL = "http://localhost:3000/posts";

// =======================
// Get data + render table
// =======================
async function getData() {
    try {
        let res = await fetch(API_URL);
        let posts = await res.json();
        let body = document.getElementById("table_body");
        body.innerHTML = "";

        for (const post of posts) {
            body.innerHTML += `
            <tr style="${post.isDeleted ? "text-decoration: line-through; color: gray;" : ""}">
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>
                    ${
                        post.isDeleted
                            ? "Deleted"
                            : `<input type="submit" value="Delete" onclick="Delete(${post.id})">`
                    }
                </td>
            </tr>`;
        }
    } catch (error) {
        console.log(error);
    }
}

// =======================
// Get next ID = maxId + 1
// =======================
async function getNextId() {
    let res = await fetch(API_URL);
    let posts = await res.json();
    if (posts.length === 0) return 1;
    let maxId = Math.max(...posts.map(p => Number(p.id)));
    return maxId + 1;
}

// =======================
// Save (Create / Update)
// =======================
async function Save() {
    let title = document.getElementById("txt_title").value;
    let views = document.getElementById("txt_views").value;

    // CREATE (khong nhap ID)
    let newId = await getNextId();

    let res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: newId,
            title: title,
            views: views,
            isDeleted: false
        })
    });

    if (res.ok) {
        console.log("them thanh cong");
        getData();
    }
}

// =======================
// Soft Delete
// =======================
async function Delete(id) {
    let res = await fetch(API_URL + "/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    if (res.ok) {
        console.log("xoa mem thanh cong");
        getData();
    }
}

// Load data
getData();
