/**
 * Upload the photos using AJAX
 */
function uploadFiles(formData) {
    $.ajax({
        url: '/upload',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        xhr: ()=>{
            var xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (event) => {
                var progressBar = $('.progress-bar')

                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total) * 100
                    progressBar.width(percent + '%')

                    if (percent === 1000)
                        progressBar.removeClass('active')
                }
            })
            return xhr
        }
    }).done(handleSuccess).fail((xhr, status) => {
        alert('status:'+status)
    })
}

/**
 * Handle upload response and display them
 */
function handleSuccess(data){
    if (data.length > 0){
        var html = '';
        var img = data[0]

        if (img.status) {
           // $('#album').append("<img style='margin-top: 16px; border: 5px solid #212529;' class='img-fluid' src='"+ img.publicPath + "' alt='" + img.filename+"'>");

            html += '<img style="margin-top: 16px; border: 5px solid #212529;" class="img-fluid" src="'+ img.publicPath + '" alt="' + img.filename+'">';
        } else {
            html += '<div class="col-xs-6 col-md-4"><a href="#" class="thumbnail">Invalid file type - ' + img.filename  + '</a></div>';
        } 
        $('#album').html(html);
    } else {
        alert('no images were upload :c')
    }
}

$('#photo-input').on('change', () => {
    $('.progress-bar').width('0%')
})

/**
 * Attached photo to formData Object 
 */

$('#upload-photo').on('submit', (e) => {
    e.preventDefault();

    var file = $('#photo-input').get(0).files,
        formData = new FormData()
    
        if(file.length === 0){
            alert('select atleast 1 file to upload')
            return false
        }
        if(file.length > 1){
            alert('you can select just 1 file to upload')
            return false
        }
        formData.append('photo', file[0], file[0].name)
        uploadFiles(formData)
})
