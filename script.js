$(document).ready(function() {
    let savedStatuses = JSON.parse(localStorage.getItem('savedStatuses')) || [];

    const demoImages = [
        "https://picsum.photos/id/1015/600/800",
        "https://picsum.photos/id/133/600/800",
        "https://picsum.photos/id/201/600/800",
        "https://picsum.photos/id/251/600/800"
    ];

    const demoVideos = [
        { thumb: "https://picsum.photos/id/1015/600/340", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        { thumb: "https://picsum.photos/id/133/600/340", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
    ];

    function renderImages() {
        const $grid = $('#imagesGrid');
        $grid.empty();
        demoImages.forEach(url => {
            const html = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card">
                        <img src="${url}" class="status-media" alt="Status Image">
                        <div class="p-3 d-flex gap-2">
                            <button class="btn btn-sm btn-success flex-fill save-btn" data-url="${url}" data-type="image">Save</button>
                            <button class="btn btn-sm btn-outline-light flex-fill preview-btn" data-url="${url}" data-type="image">Preview</button>
                        </div>
                    </div>
                </div>`;
            $grid.append(html);
        });
    }

    function renderVideos() {
        const $grid = $('#videosGrid');
        $grid.empty();
        demoVideos.forEach(vid => {
            const html = `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card">
                        <img src="${vid.thumb}" class="status-media" alt="Status Video">
                        <div class="p-3 d-flex gap-2">
                            <button class="btn btn-sm btn-success flex-fill save-btn" data-url="${vid.url}" data-type="video">Save</button>
                            <button class="btn btn-sm btn-outline-light flex-fill preview-btn" data-url="${vid.url}" data-type="video">Preview</button>
                        </div>
                    </div>
                </div>`;
            $grid.append(html);
        });
    }

    function renderSaved() {
        const $list = $('#savedList');
        $list.empty();
        savedStatuses.forEach((item, idx) => {
            let media = item.type === 'image' 
                ? `<img src="${item.url}" class="img-fluid rounded" style="max-height:200px;">`
                : `<video src="${item.url}" class="w-100 rounded" controls></video>`;
            
            const html = `
                <div class="list-group-item bg-dark border-secondary d-flex gap-3 align-items-center">
                    <div style="flex:0 0 160px;">${media}</div>
                    <div class="flex-grow-1">
                        <small class="text-success">${item.type.toUpperCase()}</small><br>
                        <small class="text-muted">${new Date(item.date).toLocaleString()}</small>
                    </div>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${idx}">Delete</button>
                </div>`;
            $list.append(html);
        });
    }

    $(document).on('click', '.preview-btn', function() {
        const url = $(this).data('url');
        const type = $(this).data('type');
        const $body = $('#previewBody');
        $body.empty();

        if (type === 'image') {
            $body.html(`<img src="${url}" class="img-fluid rounded">`);
        } else {
            $body.html(`<video src="${url}" class="w-100 rounded" controls autoplay></video>`);
        }

        $('#previewTitle').text(type === 'image' ? 'Status Image' : 'Status Video');
        $('#downloadPreviewBtn').data({url: url, type: type});
        $('#previewModal').modal('show');
    });

    $('#downloadPreviewBtn').on('click', function() {
        const url = $(this).data('url');
        const type = $(this).data('type');
        saveStatus(url, type);
    });

    $(document).on('click', '.save-btn', function() {
        const url = $(this).data('url');
        const type = $(this).data('type');
        saveStatus(url, type);
    });

    function saveStatus(url, type) {
        savedStatuses.unshift({ url: url, type: type, date: Date.now() });
        localStorage.setItem('savedStatuses', JSON.stringify(savedStatuses));
        renderSaved();
        alert(`✅ ${type.toUpperCase()} saved successfully!`);
    }

    $(document).on('click', '.delete-btn', function() {
        if (confirm('Delete this saved status?')) {
            const idx = $(this).data('index');
            savedStatuses.splice(idx, 1);
            localStorage.setItem('savedStatuses', JSON.stringify(savedStatuses));
            renderSaved();
        }
    });

    // Initialize
    renderImages();
    renderVideos();
    renderSaved();
});
