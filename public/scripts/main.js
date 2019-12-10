$(document).ready(() => {
    $('#title').autocomplete({
        source: (req, res) => {
            $.ajax({
                url: '/live/search?title='+req.term,
                dataType: 'json',
                type: 'GET',
                success: (data) => {
                    res($.map(data, (el) =>{
                        return {
                            label: el.title,    
                            value: el.title                     
                        }
                    }))
                },
                error: (xhr) => {
                    alert(xhr.status + ' er: ' + xhr.statusText)
                }
            })
        },
        minLength: 3,
    })
    $('.search').click((e)=>{
        e.preventDefault();
        var string = $('#title').val()
        $.ajax({
            url: '/live/search?title='+string,
            dataType: 'json',
            type: 'GET',
            success: data => {
                $(data).each(d => {
                    $('.posts').remove();
                    return $('.boxes').prepend("<div class='posts'><h2>"+data[d].title+"</h2><p>"+data[d].description+"</p>")
                })
            }
        })
    })
    $('.delete').click((e) => {
        e.preventDefault();
        $.ajax({
            url: '/posts/delete/'+e.currentTarget.dataset.id,
            type: 'DELETE',
            success: function(response){
                $(e.target).parent('.posts').remove()
            },
            error: function(err){
                console.log(err);
            }
        });
    })
})
